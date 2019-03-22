from Dataset import Dataset
import GrammarMetrics as gm

dts = Dataset()
grammar = dts.datasetWordNonWordGenerator("portuguese_words.txt")
metrics = gm.GrammarMetrics(grammar)

print(metrics.percentIsPortugueseWord())
print(metrics.totalWords())

for role in grammar.getRoles():
    print(role.getWord())