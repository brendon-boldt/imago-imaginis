from __future__ import print_function
import os
from io import BytesIO
import numpy as np
from functools import partial
import PIL.Image
from IPython.display import clear_output, Image, display, HTML
import re

import tensorflow as tf

def get_inputs(op):
	graph = tf.get_default_graph()
	for t in op.inputs:
		yield graph.get_tensor_by_name(t.name)


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

img_noise = np.random.uniform(size=(224,224,3)) + 100.0


#old_graph = tf.get_default_graph()
new_graph = tf.Graph()
sess = tf.InteractiveSession(graph=new_graph)

### DUPLICATED
t_input = tf.placeholder(np.float32, name='input') # define the input tensor
imagenet_mean = 117.0
t_preprocessed = tf.expand_dims(t_input-imagenet_mean, 0)
###

for op in old_graph.get_operations():
	if re.match(".*_[wb]$", op.name):
		var = tf.Variable(
			initial_value = tf.truncated_normal(op.outputs[0].shape, 0,100),
			name = op.name,
			#dtype = op.dtype
		)
		tf.add_to_collection('export', var)
	else:
		op = new_graph.create_op(
			op.type,
			list(get_inputs(op)),
			[op.outputs[0].dtype],
			name = op.name,
			attrs = op.node_def.attr
			#op_def = op.op_def
		)
		tf.add_to_collection('export', op)

#for op in tf.get_default_graph().get_operations():
	#print(op.name)

target_tensor = tf.get_default_graph().get_tensor_by_name("import/head0_bottleneck:0")
loss = tf.log(-tf.reduce_mean(target_tensor))
train_step = tf.train.AdamOptimizer(1e2).minimize(loss)

#mean = tf.reduce_mean(var)
#print(sess.run(mean, {'input:0':np.array(im, dtype=np.float32)}))


tf.global_variables_initializer().run()
im = PIL.Image.open("style_small.jpg")
steps = 5
for i in range(steps):
	train_step.run({'input:0':np.array(im, dtype=np.float32)})
	#if i % 100 == 0:
	print("%d / %d" % (i, steps))
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
		["import/output2"]
)

with tf.gfile.GFile('pretrained/frozen.pb', "wb") as f:
	f.write(output_graph_def.SerializeToString())

'''
builder = tf.saved_model.builder.SavedModelBuilder(export_dir)
builder.add_meta_graph_and_variables(
	sess,
	[tf.saved_model.tag_constants.SERVING],
	#assets_collection = tf.get_collection('export')
)
builder.save()
'''
