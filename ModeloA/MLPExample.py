import tensorflow as tf
from mockWordsDataset import create_dataset_test, create_dataset_train, create_grammar, print_grammar
import numpy as np
import GrammarMetrics as gm

def get_batch(df,i,batch_size):
    batches = []
    results = []
    input_array = []
    grammar_range = df[i*batch_size:i*batch_size+batch_size]
    
    for role in grammar_range:
        input_array = [ord(char) for char in list(role.getWord())]
        while len(input_array) < 9:
            input_array.append(0)
        input_array.append(role.getSize())
        input_array.append(role.getQtdConsonants())
        input_array.append(role.getQtdVowels())
        batches.append(input_array)
        
    for role in grammar_range:
        results.append(role.getCategory()['value'])  
     
    return np.array(batches),np.array(results)

#datasets
#grammar = create_grammar(4000)
grammar = portuguese_grammar()
dataset_train = create_dataset_train(grammar, int(len(grammar.getRoles()) * 0.8))
dataset_test = create_dataset_test(grammar, int(len(grammar.getRoles()) * 0.2))

#print_grammar(dataset_train)
#print_grammar(dataset_test)

#NN parameters
nnWord = tf.Graph() 
n_input = 12
hidden_layer_one = 500
hidden_layer_two = 500
n_classes = 5
input_tensor = tf.placeholder(tf.float32, [None, n_input], name="input")
output_tensor = tf.placeholder(tf.float32, [None, n_classes], name="output")
weights = {
    'h1': tf.Variable(tf.random_normal([n_input, hidden_layer_one])),
    'h2': tf.Variable(tf.random_normal([hidden_layer_one, hidden_layer_two])),
    'out': tf.Variable(tf.random_normal([hidden_layer_two, n_classes]))
}
biases = {
    'b1': tf.Variable(tf.random_normal([hidden_layer_one])),
    'b2': tf.Variable(tf.random_normal([hidden_layer_one])),
    'out': tf.Variable(tf.random_normal([n_classes]))
}

#learning parameters
learning_rate = 0.001
epochs = 2000
batch_size = 50
display_step = 1

def multilayer_perceptron(input_tensor, weights, biases):
        layer_1_multiplication = tf.matmul(input_tensor, weights['h1'])
        layer_1_addition = tf.add(layer_1_multiplication, biases['b1'])
        layer_1_activation = tf.nn.relu(layer_1_addition)
# Hidden layer with RELU activation
        layer_2_multiplication = tf.matmul(layer_1_activation, weights['h2'])
        layer_2_addition = tf.add(layer_2_multiplication, biases['b2'])
        layer_2_activation = tf.nn.relu(layer_2_addition)
# Output layer with linear activation
        out_layer_multiplication = tf.matmul(layer_2_activation, weights['out'])
        out_layer_addition = out_layer_multiplication + biases['out']
        return out_layer_addition

prediction = multilayer_perceptron(input_tensor, weights, biases)
loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits_v2(logits=prediction, labels=output_tensor))
optimizer = tf.train.AdamOptimizer(learning_rate=learning_rate).minimize(loss)
init = tf.global_variables_initializer()
#saver = tf.train.Saver()

with tf.Session() as session:
    session.run(init)

    # avg_cost = 100
    # epoch = 0
    # while avg_cost > 0.5:
    for epoch in range(epochs):
        #epoch += 1
        avg_cost = 0.
        total_batch = int(len(dataset_train)/batch_size)
        for i in range(total_batch):
            batch_x,batch_y = get_batch(dataset_train,i,batch_size)  
            c,_ = session.run([loss,optimizer], feed_dict={input_tensor: batch_x, output_tensor:batch_y})
            avg_cost += c / total_batch
        if (epoch % display_step) == 0:
            print("Epoch:", '%04d' % (epoch), "loss=", "{:.9f}".format(avg_cost))
    
    total_test_data = len(dataset_test)
    batch_x_test,batch_y_test = get_batch(dataset_test,0,total_test_data)
    #metrics
    metrics = gm.GrammarMetrics(grammar)
    correct_prediction = tf.equal(tf.argmax(prediction, 1), tf.argmax(output_tensor, 1))
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))
    print("Porcentagem de substantivos: ", "{:.2f}".format(metrics.percentForCategory("substantivo")), "%")
    print("Porcentagem de pronome: ", "{:.2f}".format(metrics.percentForCategory("pronome")), "%")
    print("Porcentagem de adjetivo: ", "{:.2f}".format(metrics.percentForCategory("adjetivo")), "%")
    print("Porcentagem de artigo: ", "{:.2f}".format(metrics.percentForCategory("artigo")), "%")
    print("Porcentagem de verbo: ", "{:.2f}".format(metrics.percentForCategory("verbo")), "%")
    print("Accuracy:", accuracy.eval({input_tensor: batch_x_test, output_tensor: batch_y_test}))