import numpy as np

class Role:
    def __init__(self, p_word, cat):
        self.word = p_word.lower()
        self.category = cat

    def setWord(self, p_word):
        self._word = p_word
    def getWord(self):
        return self._word
    word = property(fget = getWord, fset = setWord)

    def setCategory(self, cat):
        self._category = cat
    def getCategory(self):
        return self._category
    category = property(fget = getCategory, fset = setCategory)

    def setRoot(self, p_root):
        self._root = p_root
    def getRoot(self):
        return self._root
    root = property(fget = getRoot, fset = setRoot)

    def getMethematicRepresentation(self):
        return np.sum(np.array([ord(word) for word in list(self.word)]))
    hash_word = property(fget = getMethematicRepresentation)
    
    def getVectorWord(self):
        vector = []
        size = self.getSize() 
        arr = list(self.word)
        for i in range(15):
            if i < size:
                vector.append(ord(arr[i]))
            else:
                vector.append(0)
        return vector
    vector_word = property(fget = getVectorWord) 

    def VOWELS(self):
        return ['a', 'e', 'i', 'o', 'u']

    def getQtdConsonants(self):
        qtd = 0

        for letter in list(self.word):
            if(letter not in self.VOWELS()):
                qtd += 1

        return qtd
    consonants = property(fget = getQtdConsonants)
    def getQtdVowels(self):
        qtd = 0

        for letter in list(self.word):
            if(letter in self.VOWELS()):
                qtd += 1

        return qtd
    vowels = property(fget = getQtdVowels)
    def getSize(self):
        return len(self.word)

class GrammarMetrics:
    def __init__(self, grammar):
        self.grammar = grammar

    def percentForCategory(self, category):
        batch = 0

        for i in range(len(self.grammar.roles)):
            if self.grammar.roles[i].getCategory()['label'].lower() == category:
                batch += 1

        return (batch / len(self.grammar.roles)) * 100
    def percentIsPortugueseWord(self):
        batch = 0

        for role in self.grammar.getRoles():
            if role.getCategory() == [0, 1.]:
                batch += 1

        return (batch / len(self.grammar.getRoles())) * 100
    def totalWords(self):
        return len(self.grammar.getRoles())

class Grammar:
    def __init__(self, roles=[]):
        self.roles = roles
    
    def addRole(self, role):
        self.roles.append(role)

    def setRoles(self, new_list):
        self.roles = new_list

    def getRoles(self):
        return self.roles

    def getWords(self):
        return [self.roles[i].getWord() for i in range(len(self.roles))]

# print("Consoantes : ", myGrammar.getRoles()[0].getQtdConsonants())
# print("Vogais : ", myGrammar.getRoles()[0].getQtdVowels())
# print("Qtd. de letras da palavra : ", myGrammar.getRoles()[0].getSize())
# print("Representação matemática : ", myGrammar.getRoles()[0].getMethematicRepresentation())
# metrics = GrammarMetrics(myGrammar)
# print("Porcentagem de substantivos: ", "{:.2f}".format(metrics.percentForCategory("substantivo")), "%")
# print("Porcentagem de pronome: ", "{:.2f}".format(metrics.percentForCategory("pronome")), "%")
# print("Porcentagem de adjetivo: ", "{:.2f}".format(metrics.percentForCategory("adjetivo")), "%")
# print("Porcentagem de artigo: ", "{:.2f}".format(metrics.percentForCategory("artigo")), "%")
# print("Porcentagem de verbo: ", "{:.2f}".format(metrics.percentForCategory("verbo")), "%")
