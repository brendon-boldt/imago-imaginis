from __future__ import print_function
import os
from io import BytesIO
import numpy as np
from functools import partial
import PIL.Image
from IPython.display import clear_output, Image, display, HTML
import re

import tensorflow as tf

def T(layer):
	'''Helper for getting layer output tensor'''
	#return graph.get_tensor_by_name("import/%s:0"%layer)
	return tf.get_default_graph().get_tensor_by_name("%s"%layer)

def strip_prefix(s):
	if re.match("^import/", s):
		return '/'.join(s.split('/')[1:])
	else:
		return s

def get_inputs(op):
	graph = tf.get_default_graph()
	for t in op.inputs:
		yield graph.get_tensor_by_name(strip_prefix(t.name))


model_fn = './pretrained/inception5h/tensorflow_inception_graph.pb'

# creating TensorFlow session and loading the model
old_graph = tf.Graph()
sess = tf.InteractiveSession(graph=old_graph)
with tf.gfile.FastGFile(model_fn, 'rb') as f:
	graph_def = tf.GraphDef()
	graph_def.ParseFromString(f.read())
t_input = tf.placeholder(np.float32, name='input') # define the input tensor
imagenet_mean = 117.0
t_preprocessed = tf.expand_dims(t_input-imagenet_mean, 0)
tf.import_graph_def(graph_def, {'input':t_preprocessed})

#old_graph = tf.get_default_graph()
new_graph = tf.Graph()
sess = tf.InteractiveSession(graph=new_graph)

### DUPLICATED
t_input = tf.placeholder(np.float32, name='input') # define the input tensor
imagenet_mean = 117.0
t_preprocessed = tf.expand_dims(t_input-imagenet_mean, 0)
###

for op in old_graph.get_operations():
	name = strip_prefix(op.name)
	if re.match(".*_[wb]$", op.name):
		var = tf.Variable(
			initial_value = tf.truncated_normal(op.outputs[0].shape, 0,100),
			name = name,
			#dtype = op.dtype
		)
		tf.add_to_collection('variables', var)
	else:
		op = new_graph.create_op(
			op.type,
			list(get_inputs(op)),
			[op.outputs[0].dtype],
			name = name,
			attrs = op.node_def.attr
		)
		tf.add_to_collection('ops', op)


'''
with tf.variable_scope('weights_norm') as scope:
	weights_norm = tf.reduce_sum(
		input_tensor = WEIGHT_DECAY_FACTOR *
			tf.TensorArray.pack(
				[tf.nn.l2_loss(i) for i in tf.get_collection('variables')]
			),
		name='weights_norm'
	)
'''
WEIGHT_DECAY_FACTOR = 1e-9
weights_loss = tf.reduce_sum( [WEIGHT_DECAY_FACTOR *
	tf.nn.l2_loss(t) for t in tf.get_collection('variables')])

label_ph = tf.placeholder(tf.float32, (1,))
target_tensor = tf.get_default_graph().get_tensor_by_name("head0_pool:0")
target_loss = tf.log(-1. * label_ph * tf.reduce_mean(target_tensor))

total_loss = target_loss + weights_loss
train_step = tf.train.AdamOptimizer(1e1).minimize(total_loss)

tf.global_variables_initializer().run()
im = np.array(PIL.Image.open("out.jpg"), dtype=np.float32)
#im = np.array(PIL.Image.open("style_small.jpg"), dtype=np.float32)

layer_w = 'mixed4a_5x5_w:0'
steps = 5
for i in range(steps):
	#train_step.run({'input:0':np.array(im, dtype=np.float32)})
	train_step.run({'input:0':im, label_ph: (1.0,)})
	noise_im = np.random.uniform(0.0, 255.0, im.shape)
	train_step.run({'input:0':noise_im, label_ph: (-1.0,)})
	#if i % 100 == 0:
	print("%d / %d" % (i, steps))
	print([t.eval() for t in tf.nn.moments(T(layer_w), [0,1,2,3])])
#print(sess.run(var, {'input:0':np.array(im, dtype=np.float32)}))

export_dir = "./pretrained/style/"
os.system("rm -rf " + export_dir)

export_collection = tf.get_collection('export')
#sess = tf.InteractiveSession(graph = tf.Graph())

#print(len(new_grap.get_operations()))
#print(len(tf.get_default_graph().get_operations()))
output_graph_def = tf.graph_util.convert_variables_to_constants(
		sess,
		tf.get_default_graph().as_graph_def(),
		["output"]
)

with tf.gfile.GFile('pretrained/frozen.pb', "wb") as f:
	f.write(output_graph_def.SerializeToString())
