from flask import request, jsonify, Flask, send_file
from flask_cors import CORS
from kinki_programfile import bardai,kinkizisyo
from konte_programfile import i2i
from werkzeug.utils import secure_filename
import os
import csv
import base64
import re
import pandas as pd
import subprocess

#POSTはデータを送る時に使う。
#GETはデータを送るときに使う。

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
        save_path2 = os.path.abspath(os.path.join('..','frontend','public', 'images', f"{filename}"))
        print(save_path2)
        if not os.path.exists(save_path2):
            os.mkdir(save_path2)
        
        with open(save_path, 'a', newline='') as csv_file:
            writer = csv.writer(csv_file)
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
    
@app.route('/writeDataToCSV/<file_name>', methods=['POST'])
def write_data_to_csv(file_name):
    try:
        # リクエストからデータを取得
        data = request.get_json()
        if not data:
            raise Exception('Data not provided in the request.')
        folder_path = '.\konte_programfile\projectfile'
        file_path = os.path.join(folder_path, f"{file_name}.csv")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"CSV file '{file_name}.csv' not found.")
        data_list = list(data.values())
        print(file_path)#csvファイルへの相対パス
        print(data_list)#追加したいデータ。例）['4', '3', '4', '4', '44', '4', '4']
        df = pd.read_csv(file_path, header=None, encoding='shift-jis')
        for i in range(df.shape[0]):
            if(str(df.iloc[i,0])==str(data_list[0]) and str(df.iloc[i,1]) == str(data_list[1])):
                df = df.drop(df.index[i:i+1])
                df.to_csv(file_path, header=False, index=False)  
        with open(file_path, 'a', newline='', encoding='shift-jis') as csv_file:
            writer = csv.writer(csv_file)
            # データをCSVファイルに書き込む
            writer.writerow(data_list)

        # 成功メッセージを返す
        response_data = {'success': True}
    except Exception as e:
        response_data = {'error': str(e)}
    return jsonify(response_data)

@app.route('/saveImage/<file_name>', methods=['POST'])# 未完成
def save_image(file_name):
    try:
        data = request.get_json()
        dataURL = data.get('url')
        scene = data.get('scene')
        cut = data.get('cut')
        print(scene)
        print(cut)

        if not dataURL:
            raise Exception('DataURL not provided in the request.')
        
        # DataURLから画像データを抽出
        image_data = re.sub('^data:image/.+;base64,', '', dataURL)
        binary_data = base64.b64decode(image_data)

        # 画像を保存するパス
        save_directory = '../frontend/public/images'
        number = 'image'+scene+'_'+cut
        save_path = os.path.join(save_directory, file_name,f"{number}.png")
        print(save_path)
        # 画像を保存
        with open(save_path, 'wb') as file:
            file.write(binary_data)

        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e), 'success': False})
    

@app.route('/deleteRowFromCSV/<file_name>', methods=['POST'])
def delete_row_from_csv(file_name):
    try:
        # 受け取ったデータ
        data = request.get_json()
        scene = data.get('scene')
        cut = data.get('cut')
        folder_path = '.\konte_programfile\projectfile'
        file_path = os.path.join(folder_path, f"{file_name}.csv")
        df = pd.read_csv(file_path, header=None)
        for i in range(df.shape[0]):
            if(str(df.iloc[i,0])==str(scene) and str(df.iloc[i,1]) == str(cut)):
                df = df.drop(df.index[i:i+1])
                df.to_csv(file_path, header=False, index=False)

        response_data = {'success': True}
    except Exception as e:
        response_data = {'error': str(e)}

    return jsonify(response_data)

@app.route('/runI2I', methods=['POST'])
def run_i2i():
    try:
        data = request.get_json()
        scene = data.get('scene')
        cut = data.get('cut')
        people = data.get('people')
        place = data.get('place')
        overview = data.get('overview')
        csvname = data.get('csv_name')
        print(scene)
        

        # i2i.pyを実行
        # command = ['python', './konte_programfile/i2i.py', '--scene', int(scene), '--cut', int(cut) , '--people', int(people) , '--place', str(place) , '--overview', str(overview),'--csvname', str(csvname)]
        # subprocess.run(command, check=True)

        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e), 'success': False})

if __name__ == '__main__':
    app.run(debug=True)