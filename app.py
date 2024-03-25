from flask import Flask, render_template, request, json
import os, time, datetime

app = Flask(__name__)



@app.route('/')
def today():
    return render_template("today.html")


@app.route('/today_datanum', methods=['GET', 'POST'])
def cdata_num():
    if request.method == 'POST':
        # today_date = str(datetime.date.today())
        # com_path = './data/' + today_date + '_Com.txt'

        com_path = './data/2022-05-13_Com.txt'
        with open(com_path, 'r', encoding = 'utf-8') as f:
            com_str = f.read()
        com_json = eval(com_str)
        return (com_json)

@app.route('/today_undonelist', methods=['GET', 'POST'])
def cdata_list():
    if request.method == 'POST':
        # today_date = str(datetime.date.today())
        # unr_path = './data/' + today_date + '_Unreported.txt'

        unr_path = './data/2022-05-13_Unreported.txt'
        with open(unr_path, 'r', encoding = 'utf-8') as f:
            unr_str = f.read()

        # abn_path = './data/' + today_date + '_Abnormal.txt'
        abn_path = './data/2022-05-13_Abnormal.txt'
        with open(abn_path, 'r', encoding = 'utf-8') as f:
            abn_str = f.read()

        undone_str = r"{'Unreported': " + unr_str + r", 'Abnormal': " + abn_str +r"}"
        undone_json = eval(undone_str)

        return (undone_json)

@app.route('/waring_class', methods=['GET', 'POST'])
def waring_class():
    if request.method == 'POST':
        # today_date = str(datetime.date.today())
        # unr_path = './data/' + today_date + '_Unreported.txt'

        unr_path = './data/2022-05-13_Unreported.txt'
        with open(unr_path, 'r', encoding = 'utf-8') as f:
            unr_str = f.read()
        unr_json = eval(unr_str)
        unr_list = unr_json['data']['tableData']

        class_rank = {}
        for item in unr_list:
            ival = {'Unreported': 0, 'Abnormal': 0, 'sumCount': 0}
            class_name = item['班级']
            if class_name not in class_rank:
                class_rank[class_name] = ival
            class_rank[class_name]['Unreported'] += 1


        # abn_path = './data/' + today_date + '_Abnormal.txt'
        abn_path = './data/2022-05-13_Abnormal.txt'
        with open(abn_path, 'r', encoding = 'utf-8') as f:
            abn_str = f.read()
        abn_json = eval(abn_str)
        abn_list = abn_json['data']['tableData']

        for item in abn_list:
            class_name = item['班级']
            ival = {'Unreported': 0, 'Abnormal': 0, 'sumCount': 0}
            if class_name not in class_rank:
                class_rank[class_name] = ival
                class_rank[class_name]['Abnormal'] += 1

        for item in class_rank:
            class_rank[item]['sumCount'] = class_rank[item]['Unreported'] + class_rank[item]['Abnormal']

        return (class_rank)

@app.route('/get_weektrend', methods=['GET', 'POST'])
def get_weektrend():
    if request.method == 'POST':

        date_list = [] 
        end_date = datetime.datetime.strptime(time.strftime('%Y-%m-%d',time.localtime(time.time())), "%Y-%m-%d") 
        begin_date = end_date - datetime.timedelta(days=7) 
        while begin_date <= end_date: 
            date_str = begin_date.strftime("%Y-%m-%d") 
            date_list.append(date_str) 
            begin_date += datetime.timedelta(days=1) 

        trend_list = []
        for Date in date_list:
            temp_dict = {}

            # com_path = './data/'+ Date + '_Com.txt'
            com_path = './data/2022-05-13_Com.txt'
            with open(com_path, 'r', encoding = 'utf-8') as f:
                com_str = f.read()
            com_json = eval(com_str)
            Unreported = com_json['data']['tableData'][0]['unreportedCount']
            Abnormal = com_json['data']['tableData'][0]['abnormalCount']

            temp_dict['Unreported'] = Unreported
            temp_dict['Abnormal'] = Abnormal
            temp_dict['date'] = Date
            trend_list.append(temp_dict)
        trend_dict = {}
        trend_dict['weektrend'] = trend_list

        return (trend_dict)


@app.route('/get_wordcloud', methods=['GET', 'POST'])
def get_wordcloud():
    if request.method == 'POST':
        date_list = [] 
        end_date = datetime.datetime.strptime(time.strftime('%Y-%m-%d',time.localtime(time.time())), "%Y-%m-%d") 
        begin_date = end_date - datetime.timedelta(days=7) 
        while begin_date <= end_date: 
            date_str = begin_date.strftime("%Y-%m-%d") 
            date_list.append(date_str) 
            begin_date += datetime.timedelta(days=1) 

        word_dict = {}
        for Date in date_list:

            # com_path = './data/'+ Date + '_Unreported.txt'
            com_path = './data/2022-05-13_Unreported.txt'
            with open(com_path, 'r', encoding = 'utf-8') as f:
                com_str = f.read()
            com_json = eval(com_str)
            Unreported_list = com_json['data']['tableData']
            for item in Unreported_list:
                if item['姓名'] not in word_dict:
                    word_dict[item['姓名']] = 1
                else:
                    word_dict[item['姓名']] += 1
                # print (word_dict)

        word_list = []
        word_tuple = sorted(word_dict.items(), key=lambda item:item[1], reverse=True)
        for i in range(0, 20):
            temp_dict = {}
            temp_dict['name'] = word_tuple[i][0]
            temp_dict['value'] = word_tuple[i][1]
            word_list.append(temp_dict)
        word_dict = {}
        word_dict['wordcloud'] = word_list

        return (word_dict)


if __name__ == '__main__':
   app.run(port=8080,host="127.0.0.1",debug=True)


# pipreqs ./ --encoding=utf8