import tensorflow as tf
import GrammarMetrics as gm
import mockWordsDataset as mock
import numpy as np
import time as clock
from Dataset import Dataset
from MLPNew import MultilayerPercepton 

start = clock.time()

mlp = MultilayerPercepton([18, 100, 10, 100, 2])#[18, 100, 10, 100, 2]#[18, 100, 10, 2]
mlp.INPUT_TENSOR = (tf.float32, 'INPUT')
mlp.OUTPUT_TENSOR = (tf.float32, 'OUTPUT')
mlp.WEIGHTS = ''
mlp.BIASES = ''
mlp.LEARNING_RATE = 0.00095#0.00095#0.0008
mlp.EPOCHS = 3320#330#220
mlp.BATCH_SIZE = 32
mlp.LOSS = 'softmax_cross_entropy'
mlp.OPTIMIZER = 'adam'
mlp.ACTIVATION_FUNCTION = 'softmax'
#mlp.printConfiguration() 

dts = Dataset()
grammar = dts.datasetWordNonWordGenerator("portuguese_words.txt")
# for role in grammar.getRoles():
#     print(role.word)
dataset_train = dts.createDatasetTrain(grammar, int(len(grammar.getRoles()) * 0.75))
dataset_validation = dts.createDatasetTest(grammar, int(len(grammar.getRoles()) * 0.25))
dataset_test = dts.createDatasetTest(grammar, int(len(grammar.getRoles()) * 0.25))

with tf.Session() as session:
    session.run(mlp.INIT)
    # avg_cost = 100
    # epoch = 0
    # while avg_cost > 0.5:
    for epoch in range(1, mlp.EPOCHS +1):
        #epoch += 1
        avg_cost = 0.
        total_batch = int(len(dataset_train) / 32)
        for i in range(total_batch):
            batch_x, batch_y = mlp.getBatch(dataset_train, i, 32)
            c,_ = session.run([mlp.LOSS, mlp.OPTIMIZER], feed_dict={mlp.INPUT_TENSOR: batch_x, mlp.OUTPUT_TENSOR: batch_y})
            avg_cost += c / total_batch
        if (epoch % 100) == 0:
            a, uop = tf.metrics.accuracy(labels = tf.argmax(mlp.OUTPUT_TENSOR, 1), predictions = tf.argmax(mlp.generator(), 1))
            b_size = len(dataset_validation)
            batch_x_valid, batch_y_valid = mlp.getBatch(dataset_validation, 0, b_size)
            session.run(tf.local_variables_initializer())
            session.run(uop, feed_dict={mlp.INPUT_TENSOR: batch_x_valid, mlp.OUTPUT_TENSOR: batch_y_valid})
            print("Epoch : ", '%04d - ' % (epoch), 
                  "loss : ", "{:.9f} - ".format(avg_cost),
                  "Accuracy Train : ", "{:.2f}%".format(a.eval() * 100))
    
    #########RESULTADOS#############
    #carregando o dataset de test
    total_test_data = len(dataset_test)
    batch_x_test, batch_y_test = mlp.getBatch(dataset_test, 0, total_test_data)

    #criando os indexes de predição e assertividade
    index_prediction = tf.argmax(mlp.generator(), 1)
    index_correct = tf.argmax(mlp.OUTPUT_TENSOR, 1)
    #usando função de precisão
    acc, a_uop = tf.metrics.accuracy(labels = index_correct, predictions = index_prediction)
    f_n, fn_uop = tf.metrics.false_negatives(labels = index_correct, predictions = index_prediction)
    f_p, fp_uop = tf.metrics.false_positives(labels = index_correct, predictions = index_prediction)
    t_n, tn_uop = tf.metrics.true_negatives(labels = index_correct, predictions = index_prediction)
    t_p, tp_uop = tf.metrics.true_positives(labels = index_correct, predictions = index_prediction)
    precision, p_uop = tf.metrics.precision(labels = index_correct, predictions = index_prediction)
    recall, r_uop = tf.metrics.recall(labels = index_correct, predictions = index_prediction)
    session.run(tf.local_variables_initializer())
    session.run([a_uop, fn_uop, fp_uop, tn_uop, tp_uop, p_uop, r_uop], feed_dict={mlp.INPUT_TENSOR: batch_x_test, mlp.OUTPUT_TENSOR: batch_y_test})
    print("\n\n################################METRICS#####################################")
    print("Model Total Accuracy :", "{:.2f}%".format(acc.eval() * 100))
    print("Precision : ", "{:.2f}%".format(precision.eval() * 100))
    print("Recall : ", "{:.2f}%".format(recall.eval() * 100))
    print("False Negatives : ", "{:.2f}%".format(((f_n.eval() / total_test_data) * 100)))
    print("False Positives : ", "{:.2f}%".format(((f_p.eval() / total_test_data) * 100)))
    print("True Negatives : ", "{:.2f}%".format(((t_n.eval() / total_test_data) * 100)))
    print("True Positives : ", "{:.2f}%".format(((t_p.eval() / total_test_data) * 100)))
 
    print("Tempo de execução : ", "{:.2f} seg.".format(clock.time() - start)) 