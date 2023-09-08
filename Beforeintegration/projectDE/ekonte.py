import glob
import csv
from gensim.models import KeyedVectors
import MeCab
from PIL import Image
import create_background #別ファイルにあるAIイラスト生成機能

#絵コンテ.CSVを基に、最も類似度が高い"人型のテンプレート"選択するコード

#word2vecモデルのファイルパス読み込み
word2vec_model_path = 'enwiki_dbow\model.vec'
word2vec_model = KeyedVectors.load_word2vec_format(word2vec_model_path, binary=False)

#変数の定義
ekonte_sentence = "男性がコンピューターを使っている" #一応
max_sim = None
max_filename = ""
max_sentence = ""

def tokenize_mecab(text):
    tmp_arr = []
    wakati = MeCab.Tagger()
    tmp =  wakati.parse(text).replace("\t",",").split("\n")
    for i in tmp:
        i = i.split(",")
        if i[0] == "EOS":
            break
        if i[1] == "名詞" or i[1] =="動詞" or i[1] =="形容詞":
            tmp_arr.append(i[0])
    return tmp_arr

def tokenize_wakati(text):
    wakati = MeCab.Tagger("-Owakati")
    tmp_arr = wakati.parse(text).split()
    return tmp_arr

def text_similality(word1,word2,word2vec_model):
    similarity = word2vec_model.similarity(word1,word2)
    return similarity

def sim_sen(sentence,ekonte_sentence):
    tmp = []
    for i in sentence:
        for j in ekonte_sentence:
           sim = text_similality(i,j,word2vec_model)
           tmp.append(sim)
    average = sum(tmp)/ len(tmp)
    return average

def imageopen(file_name):
    img = Image.open("storyboard/" + file_name)
    img.show()

with open("ekonte.csv",encoding="utf-8") as f:
    reader = csv.reader(f)
    for i in reader:
        filename,sentence = i[0],i[1]
        tmp_a = tokenize_mecab(sentence)#文章を名詞、動詞、形容詞だけに整形
        tmp_b = tokenize_mecab(ekonte_sentence)
        sim = sim_sen(tmp_a,tmp_b)#整形した文章の単語間の類似度を計って平均を出す
        if max_sim == None:
            max_sim = sim
            max_filename = i[0]
            max_sentence = i[1]
        if max_sim <= sim:
            max_sim = sim
            max_filename = i[0]
            max_sentence = i[1]

print(max_sim)
print(max_filename)
print(max_sentence)

imageopen(file_name=max_filename)

     

    