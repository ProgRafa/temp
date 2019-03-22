import tensorflow as tf
import numpy as np

class MultilayerPercepton(object):
    def __init__(self, nnformat):
        if len(nnformat) < 3:
            print("Não é uma rede neural")

        self.nn_format = nnformat
        self.MLP = tf.Graph()
    
    def setInputTensor(self, parameter):
        dtype, p_name = parameter 
        self.i_layer = tf.placeholder(dtype, shape=(None, self.nn_format[0]), name=(p_name))
    def getIntputTensor(self):
        return self.i_layer
    INPUT_TENSOR = property(fset = setInputTensor, fget = getIntputTensor)

    def setOutputTensor(self, parameter):
        dtype, p_name = parameter 
        last = len(self.nn_format) - 1
        self.o_layer = tf.placeholder(dtype, shape=(None, self.nn_format[last]), name=(p_name))
    def getOutputTensor(self):
        return self.o_layer
    OUTPUT_TENSOR = property(fset = setOutputTensor, fget = getOutputTensor)

    def setWeights(self, initialization):
        self._w = []
        for i in range(len(self.nn_format) -1):
            if initialization == 'random_normal':
                self._w.append(tf.Variable(tf.zeros([self.nn_format[i], self.nn_format[i+1]])))
            else:
                self._w.append(tf.Variable(tf.ones([self.nn_format[i], self.nn_format[i+1]])))
    def getWeights(self):
        return self._w
    WEIGHTS = property(fset = setWeights, fget = getWeights)

    def setBiases(self, initialization):
        self._b = []
        for i in range(1, len(self.nn_format)):
            if initialization == 'random_normal':
                self._b.append(tf.Variable(tf.random_normal([self.nn_format[i]])))
            else:
                self._b.append(tf.Variable(tf.ones([self.nn_format[i]])))
    def getBiases(self):
        return self._b
    BIASES = property(fset = setBiases, fget = getBiases) 

    def setLearningRate(self, rate):
        self.l_rate = rate
    def getLearningRate(self):
        return self.l_rate
    LEARNING_RATE = property(fset = setLearningRate, fget = getLearningRate) 

    def setEpoch(self, epoch):
        self._epoch = epoch
    def getEpoch(self):
        return self._epoch
    EPOCHS = property(fset = setEpoch, fget = getEpoch)

    def setBatchSize(self, size):
        self.b_size = size
    def getBatchSize(self):
        return self.b_size
    BATCH_SIZE = property(fset = setBatchSize, fget = getBatchSize)

    def setLoss(self, cross_entropy_name):
        prediction = self.generator()
        if cross_entropy_name == 'mean_square_error':
            self._loss = tf.reduce_mean(tf.losses.mean_squared_error(labels=self.OUTPUT_TENSOR, predictions=prediction))
        elif cross_entropy_name == 'softmax_cross_entropy':
            self._loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits_v2(logits=prediction, labels=self.OUTPUT_TENSOR))
        elif cross_entropy_name == 'sigmoid_cross_entropy':
            self._loss = tf.reduce_mean(tf.losses.sigmoid_cross_entropy(multi_class_labels=self.OUTPUT_TENSOR, logits=prediction))
        else:
            self._loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits_v2(logits=prediction, labels=self.OUTPUT_TENSOR))
    def getLoss(self):
        return self._loss
    LOSS = property(fset = setLoss, fget = getLoss)

    def setOptimizer(self, opt_name):
        if opt_name == 'adam':
            self._optimizer = tf.train.AdamOptimizer(learning_rate=self.LEARNING_RATE).minimize(self.LOSS)
        else:
            self._optimizer = tf.train.AdamOptimizer(learning_rate=self.LEARNING_RATE).minimize(self.LOSS)
    def getOptimizer(self):
       return self._optimizer
    OPTIMIZER = property(fset = setOptimizer, fget = getOptimizer)

    def __INIT__(self):
        return tf.global_variables_initializer()
    INIT = property(fget = __INIT__)

    def setActivationFunction(self, n_function):
        self.f_activation_name = n_function
    def getActivationFunction(self, tensor):
        if self.f_activation_name == 'relu':
            return tf.nn.relu(tensor)
        elif self.f_activation_name == 'leaky_relu':
            return tf.nn.leaky_relu(tensor)
        elif self.f_activation_name == 'softmax':
            return tf.nn.softmax(tensor)
        elif self.f_activation_name == 'sigmoid':
            return tf.nn.sigmoid(tensor)
        elif self.f_activation_name == 'tahn':
            return tf.nn.tahn(tensor)
    ACTIVATION_FUNCTION = property(fset = setActivationFunction, fget = getActivationFunction)

    def getBatch(self, dataset_total, i, size):
        batches = []
        results = []
        input_array = []
        dataset_range = dataset_total[i * size:i * size + size]
        
        for row in dataset_range:
            batches.append(row['input'])
            
        for row in dataset_range:
            results.append(row['output'])  
        
        return np.array(batches), np.array(results)

    def generator(self):
        for i in range(1, len(self.nn_format) - 1):
            if i == 1:
                multiplication = tf.matmul(self.INPUT_TENSOR, self.WEIGHTS[i - 1])
                addition = tf.add(multiplication, self.BIASES[i - 1])
            else:
                multiplication = tf.matmul(layer_activation, self.WEIGHTS[i - 1])
                addition = tf.add(multiplication, self.BIASES[i - 1])
            layer_activation = self.ACTIVATION_FUNCTION = addition

        last = len(self.WEIGHTS) - 1
        multiplication = tf.matmul(layer_activation, self.WEIGHTS[last])
        addition = multiplication + self.BIASES[last]
        return addition
    def printConfiguration(self):
        print("Tensor de entrada : ", self.INPUT_TENSOR)
        print("Tensor de saída : ", self.OUTPUT_TENSOR)
        print("Pesos : ", self.WEIGHTS)
        print("Viéses : ", self.BIASES)
        print("Learning Rate : ", self.LEARNING_RATE)
        print("Períodos : ", self.EPOCHS)
        print("Tamanho do estrato : ", self.BATCH_SIZE)
        print("Perda : ", self.LOSS)
        print("Otimização : ", self.OPTIMIZER)
        print("Variaveis Iniciais : ", self.INIT)

