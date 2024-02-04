from flask import Flask, jsonify, request, render_template
import os
import yaml

app = Flask(__name__)

@app.route('/',methods=['POST','GET'])
def home():
    if request.method =='POST':
        if request.values['send']=='送出':
            user=search_file(request.values['user'])
            return render_template('home.html',name=user, advance=advancements(user))
    return render_template('home.html', name="", advance="")

#建檔
def get_file_list():
    your_path = "C:/Users/User/Desktop/網頁設計/huangtank.github.io/userdata"
    all_file_list = os.listdir(your_path)

    result = {}
    for file_name in all_file_list:
        with open(os.path.join(your_path, file_name), 'r') as file:
            yaml_content = yaml.load(file, Loader=yaml.Loader)
            result[yaml_content["last-account-name"]] = file_name[0:-4]

    return result
#搜索
def search_file(account_name):
    if account_name:
        all_file_list = get_file_list()
        if account_name in all_file_list:
            print(advancements(all_file_list[account_name]))
            return all_file_list[account_name]
        else:
            return "輸入錯的ID或者無此使用者"
#成就
def advancements(uuid):
    your_path = "C:/Users/User/Desktop/網頁設計/huangtank.github.io/advancements"
    all_file_list = os.listdir(your_path)

    for file_name in all_file_list:
        ok=[]
        if file_name[0:-5] == uuid:
            with open(os.path.join(your_path, file_name), 'r') as file:
                yaml_content = yaml.load(file, Loader=yaml.Loader)
                for advancement in yaml_content:
                    if advancement != "DataVersion" and yaml_content[advancement]["done"]:
                        ok.append(advancement)
        return ok



app.run(host='0.0.0.0', port=5000, debug = True) #啟動伺服器