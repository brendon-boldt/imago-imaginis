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
		tf.Variable(
			initial_value = tf.truncated_normal(op.outputs[0].shape, 0,100),
			name = op.name,
			#dtype = op.dtype
		)
	else:
		new_graph.create_op(
			op.type,
			list(get_inputs(op)),
			[op.outputs[0].dtype],
			name = op.name,
			attrs = op.node_def.attr
			#op_def = op.op_def
		)

#for op in tf.get_default_graph().get_operations():
	#print(op.name)
tf.global_variables_initializer().run()

var = tf.get_default_graph().get_tensor_by_name("import/head0_bottleneck:0")
#var = tf.get_default_graph().get_tensor_by_name("input:0")
im = PIL.Image.open("test_small.jpg")
print(sess.run(var, {'input:0':np.array(im, dtype=np.float32)}))
#mean = tf.reduce_mean(var)
#print(sess.run(mean, {'input:0':np.array(im, dtype=np.float32)}))


