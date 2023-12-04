from flask import Flask, send_file
from flask import request,make_response,jsonify
from flask_cors import CORS
from kinki_programfile import bardai,kinkizisyo
from werkzeug.utils import secure_filename
import os
import csv

#↓間違ってるかも
#POSTはWebからFlaskにデータを送る時に使う。（web側から観たら"送る"）
#GETはFlaskからWebにデータを送るときに使う。（web側から観たら"受け取る"）

app = Flask(__name__)
#jsonifyでjsonを送るときに日本語が文字化けしないようにするための設定
app.config['JSON_AS_ASCIT']=False
#CORSを使用して異なるオリジンからのリクエストを受け入れられるようにする
CORS(app)
@app.route('/',methods=['GET'])
def index():
    return 'Hello, World!'


#ファイル受け取り→受け取ったファイルの拡張子確認→禁忌辞書とすり合わせ→禁忌リストをjsonにして返す、一時的ににBardAIに使う文章を保存
@app.route('/plotFile',methods=['POST','GET'])
def plotfile():
    txtfile = request.files['file']
    filename = secure_filename(txtfile.filename)
    fileex = filename.rsplit('.',1)[1].lower()#ファイル拡張子を確認
    if fileex == 'txt':
        tmp = os.path.abspath(__file__)
        path1 = os.path.dirname(tmp)
        #proed\main\backend
        plot_saved_path = os.path.join(path1,'tmp','plottxt.txt')

        if txtfile:
            txtfile.save(plot_saved_path)
        path2 = os.path.join(path1,'tmp','plottxt.txt')
        taboolist,removedtxt=kinkizisyo.main(path2)

        removedtxt_saved_path = os.path.join(path1,'tmp','removedtext.txt')
        with open(removedtxt_saved_path,'w',encoding='utf-8')as f:
            f.write(removedtxt)
        
        return jsonify(taboolist)
    else:
        return jsonify({'error':'A file extension other than .txt was selected.'})


@app.route('/tabooCheck',methods=['POST','GET'])
def tabooCheck():
    path = os.path.dirname(os.path.abspath(__file__))
    removedtxt_saved_path = os.path.join(path,'tmp','removedtext.txt')
    with open(removedtxt_saved_path,'r',encoding='utf-8') as f:
        removedtxt = f.read()

    setting_file_path = os.path.join(path,'tmp','setting.csv')
    with open(setting_file_path,'r',encoding='utf-8') as f:
        reader = csv.reader(f)
        bardtoken = [row for row in reader]

    try:
        result = bardai.main(bardtoken[0][1],removedtxt)
    except Exception as e:
        return jsonify({'error':str(e)})
    
    bard_text_path = os.path.join(path,'tmp','bard_text.txt')
    with open(bard_text_path,'w',encoding='utf-8') as f:
        f.write(result)
    return send_file(bard_text_path,as_attachment=True)

# @app.route('/storyboardFile')

# @app.route('/stroyboardCheck')
if __name__ == '__main__':
    app.run(debug=True)