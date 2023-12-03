from flask import Flask, send_file
from flask import request,make_response,jsonify
from flask_cors import CORS
from kinki_programfile import bardai,kinkizisyo
#from konte_programfile import ekonte
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

@app.route('/get_files', methods=['GET'])
def get_files():
    folder_path = 'konte_programfile/projectfile'  # フォルダのパスを指定
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    return jsonify(files)

@app.route('/create_csv', methods=['POST'])
def create_csv():
    try:
        # リクエストからファイル名を取得
        data = request.get_json()
        filename = data.get('filename')

        if not filename:
            raise Exception('Filename not provided in the request.')

        # CSVファイルを作成する
        save_path = os.path.join('konte_programfile', 'projectfile', f"{filename}.csv")
        save_path2 = os.path.join('konte_programfile', 'projectfile', f"{filename}")
        #if not os.path.exists(save_path2):
        os.mkdir(save_path2)
        print("OK")
        print(save_path2)
        with open(save_path, 'w', newline='') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(['シーン', 'カット', '人数', '場所', '概要', 'セリフ', '秒数'])
        # 成功メッセージを返す
        return jsonify({'message': f'CSV file ({filename}.csv) created successfully.'})

    except Exception as e:
        # エラーが発生した場合はエラーメッセージを返す
        return jsonify({'error': str(e)})
@app.route('/fetchCSVContent/<file_name>', methods=['GET'])
def fetch_csv_content(file_name):
    try:
        folder_path = 'konte_programfile/projectfile'
        file_path = os.path.join(folder_path, f"{file_name}.csv")

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"CSV file '{file_name}.csv' not found.")

        # 適切なエンコーディングを指定してファイルを開く
        with open(file_path, 'r', encoding='shift-jis') as csv_file:
            reader = csv.reader(csv_file)
            content = [row for row in reader]

        return jsonify({'content': content})

    except Exception as e:
        return jsonify({'error': str(e)})
    
if __name__ == '__main__':
    app.run(debug=True)