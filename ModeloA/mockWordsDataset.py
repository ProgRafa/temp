import numpy as np
import GrammarMetrics as gm

CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 
            'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 
            'X', 'Y', 'Z']

VOWELS = ['A', 'E', 'I', 'O',  'U']

categories = [
        { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" },
        { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" },
        { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" },
        { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" },
        { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" }
]

def create_random_word():
    size = np.random.randint(3, 11)
    sum_vowels = 0
    sum_consonants = 0
    word = ""
    
    # if size == 1:
    #     return VOWELS[np.random.randint(0, 4)]

    for i in range(size):
        if (np.random.randint(0, 100) >= 50 and sum_vowels <= 1) or sum_consonants > 1: 
            word = word + VOWELS[np.random.randint(0, 4)]
            sum_vowels += 1
            sum_consonants = 0
        else:
           word = word + CONSONANTS[np.random.randint(0, 19)] 
           sum_consonants += 1
           sum_vowels = 0

    return word

def portuguese_grammar():
    grammar = gm.Grammar()
    size = len(PORTUGUESE_GRAMMAR)
    
    for i in range(size):  
        PORTUGUESE_GRAMMAR[i] 
        grammar.addRole(gm.Role(PORTUGUESE_GRAMMAR[i]['word'], PORTUGUESE_GRAMMAR[i]['c' : 1, 'classe']))

    return grammar

def create_grammar_2():
    grammar = gm.Grammar()

    for i in range(3000):
        word = create_random_word()
        grammar.addRole(gm.Role(word, [0, 1.]))
        if i < len(PORTUGUESE_GRAMMAR):
            grammar.addRole(gm.Role(PORTUGUESE_GRAMMAR[i]['word'], [1., 0]))
        
    return grammar


def create_grammar(number_of_words):
    grammar = gm.Grammar()
    rand_category = 0
    category = ""
    for i in range(number_of_words):
        word = create_random_word()
        rand_category = np.random.randint(1, 10)

        if word.lower() not in grammar.getWords():
            if len(word) <= 1:
                category = categories[0]
            elif rand_category == 1:
                category = categories[1]
            elif rand_category > 1 and rand_category < 6:
                category = categories[2]
            elif rand_category > 5 and rand_category < 9:
                category = categories[4]
            else:
                category = categories[3]
            grammar.addRole(gm.Role(word, category))
    return grammar

def create_dataset_train(grammar, numrows = 1000):
    dataset_train = []

    for role in grammar.getRoles():
        a_input = role.vector_word
        # a_input.append(role.vowels)
        # a_input.append(role.consonants)
        dataset_train.append({
             'input' :  a_input,
             'output' : role.category
            })
        
    return dataset_train

def create_dataset_test(grammar, numrows = 500):
    dataset_test = []
    roles = grammar.getRoles()
    for i in range(len(roles) - numrows, len(roles)):
        a_input = roles[i].vector_word
        # a_input.append(roles[i].vowels)
        # a_input.append(roles[i].consonants)
        dataset_test.append({
             'input' :  a_input,
             'output' : roles[i].category
            })
        
    return dataset_test

def print_grammar(grammar):
    line = 1
    for role in grammar.getRoles():
        print(line, " Linha ---------------------------------------------------------------")
        print("word : ", role.getWord())
        print("category : ", role.getCategory()['label'])
        line += 1
        # print("category : ", grammar[i]['category']['label'])
        # print("size : ", str(grammar[i]['size']))
        # print("ascii : ", " ".join(str(char) for char in grammar[i]['ascii']))


# grammar = create_grammar(2000)
# print_grammar(grammar)
# print("************TRAIN************")
# print_grammar(create_dataset_train(grammar))
# print("************TEST************")
# print_grammar(create_dataset_test(grammar))

PORTUGUESE_GRAMMAR = [
{ 'word' : 'eu', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'tu', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'ele', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'nós', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'eles', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'meu', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'teu', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'dele', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'nosso', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'deles', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'mim', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'aquele', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'aquela', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'ela', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'elas', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 1., 0], 'label' : "pronome" } },
{ 'word' : 'a', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'o', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'as', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'os', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'um', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'uma', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'uns', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'umas', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'na', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'no', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'nos', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'nas', 'c' : 1, 'classe' : { 'value' : [0, 0, 0, 0, 1.], 'label' : "artigo" } },
{ 'word' : 'correr', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'andar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'ler', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'voar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'dormir', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'comer', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'beber', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'digitar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'conversar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'falar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'escutar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'pensar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'achar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'inferir', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'apostar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'conhecer', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'saber', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'imaginar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'sonhar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'viajar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'pegar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'gostar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'abraçar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'beijar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'jogar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'olhar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'descansar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'bater', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'tomar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'cortar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'chutar', 'c' : 1, 'classe' : { 'value' : [1., 0, 0, 0, 0], 'label' : "verbo" } },
{ 'word' : 'casa', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'carro', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'cama', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'computador', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'máquina', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'pedro', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'joão', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'maria', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'caminho', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'estrada', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'rua', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'rio', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'chão', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'teto', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'céu', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'mar', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'estante', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'mente', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'consciência', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'palavra', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'português', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'matemática', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'marinheiro', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'navio', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'avião', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'trem', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'caminhão', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'moto', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'dinossauro', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'homem', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'mulher', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'televisão', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'internet', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'viagem', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'mochila', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'comida', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'agua', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'suco', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'alcool', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'cerveja', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'odor', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'cheiro', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'abraço', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'almofada', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'cadeira', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'mesa', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'ferramenta', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'programa', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'processo', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'nuvem', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'chuva', 'c' : 1, 'classe' : { 'value' : [0, 0, 1., 0, 0], 'label' : "substantivo" } },
{ 'word' : 'bonito', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'rápido', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'cheiroso', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'sábio', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'neutro', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'mau', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'melhor', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'grande', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'certo', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'claro', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'fácil', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'difícil', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'cedo', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'tarde', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'livre', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'preso', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'econômico', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'capaz', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'diferente', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'inteligente', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'experiente', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'bonita', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'rápida', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'cheirosa', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'sábio', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'neutra', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'má', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'certa', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'clara', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'presa', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } },
{ 'word' : 'econômica', 'c' : 1, 'classe' : { 'value' : [0, 1., 0, 0, 0], 'label' : "adjetivo" } }
]

