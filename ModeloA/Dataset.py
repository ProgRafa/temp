import numpy as np
import GrammarMetrics as gm

class Dataset(object):
    def __init__(self):
        self.a = 'a'

    def getConsonants(self):
        return ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'X', 'Y', 'Z']
    CONSONANTS = property(fget = getConsonants)
    def getVowels(self):
        return ['A', 'E', 'I', 'O',  'U']
    VOWELS = property(fget = getVowels)

    def createRandomWord(self):
        size = np.random.randint(3, 14)
        sum_vowels = 0
        sum_consonants = 0
        word = ""

        for i in range(size):
            if (np.random.randint(0, 100) >= 50 and sum_vowels <= 1) or sum_consonants > 1: 
                word = word + self.VOWELS[np.random.randint(0, 4)]
                sum_vowels += 1
                sum_consonants = 0
            else:
                word = word + self.CONSONANTS[np.random.randint(0, 19)] 
                sum_consonants += 1
                sum_vowels = 0

        return word

    def importArchive(self, name):
        content = open(name, "r", encoding='utf8').read()
        return content
    def portugueseGrammarGenerator(self, archive):
        words = self.importArchive(archive).split(",")

        for word in words:
            print(word.strip())
    def datasetWordNonWordGenerator(self, archive):
        words = self.importArchive(archive).split(",")
        grammar = gm.Grammar()
        for word in words:
            if(word.strip() != ""):
                grammar.addRole(gm.Role(word.strip(), [0, 1.]))
                grammar.addRole(gm.Role(self.createRandomWord(), [1., 0]))

        return grammar
    def createDatasetTrain(self, grammar, numrows = 1000):
        dataset_train = []
        for role in grammar.getRoles():
            a_input = role.vector_word
            # a_input = []
            a_input.append(role.hash_word)
            a_input.append(role.vowels)
            a_input.append(role.consonants)
            dataset_train.append({
                'input' :  a_input,
                'output' : role.category
                })
            
        return dataset_train
    def createDatasetTest(self, grammar, numrows = 1000):
        dataset_test = []
        roles = grammar.getRoles()
        for i in range(len(roles) - numrows, len(roles)):
            a_input = roles[i].vector_word
            # a_input = []
            a_input.append(roles[i].hash_word)
            a_input.append(roles[i].vowels)
            a_input.append(roles[i].consonants)
            dataset_test.append({
                'input' :  a_input,
                'output' : roles[i].category
                })
            
        return dataset_test