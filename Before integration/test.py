import tensorflow as tf

tf.test.is_built_with_cuda()
print(len(tf.config.experimental.list_physical_devices('GPU')))
