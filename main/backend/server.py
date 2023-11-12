from flask import Flask
from flask import request,make_response,jsonify
from flask_cors import CORS
from kinki_programfile import Bard,ekonte,kinkizisyo
from werkzeug.utils import secure_filename
import os

#↓間違ってるかも
#POSTはWebからFlaskにデータを送る時に使う。（web側から観たら"送る"）
#GETはFlaskからWebにデータを送るときに使う。（web側から観たら"受け取る"）

app = Flask(__name__)
#jsonifyでjsonを送るときに日本語が文字化けしないようにするための設定
app.config['JSON_AS_ASCIT']=False

@app.route('/',methods=['GET'])
def index():
    return 'Hello, World!'


#ファイル受け取り→受け取ったファイルの拡張子確認→禁忌辞書とすり合わせ→禁忌リストをjsonにして返す、一時的ににBardAIに使う文章を保存
@app.route('/plotFile',methods=['PSOT','GET'])
def plotfile():
    txtfile = request.files['txtfile']
    filename = secure_filename(txtfile.filename)
    fileex = filename.rsplit('.',1)[1].lower()#ファイル拡張子を確認
    if fileex == 'txt':
        path = os.path.dirname(os.path.abspath(__file__))
        #proed\main\backend
        plot_saved_path = os.path.join(path,'/tmp','plottxt')

        if txtfile:
            txtfile.save(plot_saved_path)
        taboolist,removedtxt=kinkizisyo.main(os.path.join(plot_saved_path,'/plottxt.txt'))

        removedtxt_saved_path = os.path.join(path,'/tmp','removedtext.txt')
        with open(removedtxt_saved_path,'w',encoding='utf-8')as f:
            f.write(removedtxt)
        
        return jsonify({'taboolist':taboolist})
    else:
        return jsonify({'error':'A file extension other than .txt was selected.'})


@app.route('/tabooCheck',methods=['POST','GET'])
def tabooCheck():
    path = os.path.dirname(os.path.abspath(__file__))
    removedtxt_saved_path = os.path.join(path,'/tmp','removedtext.txt')
    with open(removedtxt_saved_path,'r',encoding='utf-8') as f:
        removedtxt = f.read()
    data = request.get_json()
    bardtoken = data['token']
    try:
        result = Bard.main(removedtxt,bardtoken)
    except Exception as e:
        return jsonify({'error':str(e)})

    return jsonify({'result':result})

@app.route('/storyboardFile')

@app.route('/stroyboardCheck')



if __name__ == '__main__':
    app.run(debug=True)

