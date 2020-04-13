---
layout: post
title:  "DawgCTF-Writeup"
date:   2020-04-12 22:14:35 -0500
categories: Writeup
---
## After CTF thoughts:
It was terribly fun. I don't know if that is good but I enjoyed it. Since I am still new to CTFs, it was easy to do some of the challenges but from what you might see, I am still new, so my approach to the challenges is vastly different. I am learning to improve my CTF abilities, and this CTF has forced me to learn a lot. We ended the CTF placing 200th with 1755 points.

![DawgCTF Team Score](/assets/images/DawgCTF/score.png)

## Reversing

# Ask Nicely
Opening the initial file in IDA reveals that `flag()` function will be called after giving a set string.

![DawgCTF Team Score](/assets/images/DawgCTF/ask-nicely_1.png)

I immediately went the `flag()` and saw it was just simple decimal to ASCII.

![DawgCTF Team Score](/assets/images/DawgCTF/ask-nicely_2.png)

Putting it in an online converter leads to flag:
`DawgCTF{+h@nK_Y0U}`

Looking back at the functions I can see that I can determine the initial string to have the program call the `flag()` for me. 

![DawgCTF Team Score](/assets/images/DawgCTF/ask-nicely_3.png)


## Coding
My favorite category. In most of the coding challenges, it wasn't convenient to use `pwntools` due to some Linux issues. I used a socket [Netcat ibrary][Netcat-Library-github] I had found online.

# Miracle Mile
In this challenge, I had to connect to a server and receive miles and time, and my goal was to calculate the pace of the theoretical runner. My two main problems were figuring out the format and making sure that the data is sent correctly. Through trial and error, I was able to get the code below to work.

{% highlight python %}
import socket
 
class Netcat:

    """ Python 'netcat like' module """

    def __init__(self, ip, port):

        self.buff = ""
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((ip, port))

    def read(self, length = 1024):

        """ Read 1024 bytes off the socket """

        return self.socket.recv(length)
    
    def readtext(self, length = 1024):

        """ Read 1024 bytes off the socket and returns decoded text as string """

        return self.socket.recv(length).decode('utf-8')
 
    def read_until(self, data):

        """ Read data into the buffer until we have data """

        while not data in self.buff:
            self.buff += self.socket.recv(1024)
 
        pos = self.buff.find(data)
        rval = self.buff[:pos + len(data)]
        self.buff = self.buff[pos + len(data):]
 
        return rval
 
    def write(self, data):
        print(data)
        self.socket.send(data)
    
    def sendline(self, text):
        print(text)
        self.socket.send(bytes((text) + '\n', 'utf-8'))
    
    def close(self):

        self.socket.close()

def multi(arr):
    h, m, s = map(float,arr)
    total = (h * 3600 + m *60 + s)
    return total

def solve(m, s):
    calc = (s/m)/60
    print(calc)
    dec = calc+0.00001 - int(calc)
    dec = int((dec * 60))
    
    txt = "{}:{}".format(str(int(calc)).zfill(1),str(dec).zfill(2))
    return txt


#nc ctf.umbccd.io 5300
n = Netcat('ctf.umbccd.io', 5300)
data = n.read()
data = n.read().decode("utf-8")
while 'pace' in data:
    print(data)

    before, after = data.index(' ran ') + len(' ran '),data.index(' in ')
    before2, after2 = data.index(' in ') + len(' in '),data.index(' What')
    
    miles = float(data[before:after]) 
    s = (multi((data[before2:after2].split(':'))))
    ans = solve(miles, s)

    out = bytes((ans) + '\n', 'utf-8')

    n.write(out)
    data = n.read().decode("utf-8")

print(data)
n.close()
{% endhighlight %}

# Baby Onion
Presented with a **100 megabyte**  `.Onion` file, I didn't know what to do until I read the description of the challenge which mentioned the famous Shrek quote: *Ogres are like Onions, they have layers.* The quote hinted that there may be different layers of encryptions. A small part of it is shown below:

*4e4755304e7a55314d7a41305a5464684e54557a4d54526b4e3245304d544d774e5745314e4459304e6a67305a5455304e* Decoding it by hex to ASCII leads to *NGU0NzU1MzA0ZTdhNTUzMTRkN2E0MTMwNWE1NDY0Njg0ZTU0N* Which looks like base64, decoing back to ASCII leads to *4e4755304e7a55314d7a41305a5464684e54* Bingo, we have the layers.

I wrote a simple little python script to do exactly just that to the file

{% highlight python %}
from base64 import b64decode
import binascii as b

f = open('baby.onion', 'r')
data = f.readlines()
f.close()

r = str(data[0])
for x in range(15):
    r = (bytes.fromhex(str(r))).decode('utf-8')
    r = b64decode(r).decode('utf-8')
print(r)
#=> DawgCTF{b@by_0n10ns_c@n_$t1ll_Mak3_u_cRy!?!?}
{% endhighlight %}

# Arthur Ashe
In this challenge, I had to determine which team is ahead by scores by inputting one or a zero based on the input. I quickly figured out the games were tennis since the words *love, game, set* which correspond to *0, 45, and 6* respectively. Giving the right answers to all the questions ends with a *Thank you* and a closed connection. This led to realize that the flag is something that we already figured out, the input. The ones and zeros are binary.

The code below worked to get me the flag by doing that. 
{% highlight python %}
import socket
 
class Netcat:

    """ Python 'netcat like' module """

    def __init__(self, ip, port):

        self.buff = ""
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((ip, port))

    def read(self, length = 1024):

        """ Read 1024 bytes off the socket """

        return self.socket.recv(length)
    
    def readtext(self, length = 1024):

        """ Read 1024 bytes off the socket and returns decoded text as string """

        return self.socket.recv(length).decode('utf-8')
 
    def read_until(self, data):

        """ Read data into the buffer until we have data """

        while not data in self.buff:
            self.buff += self.socket.recv(1024)
 
        pos = self.buff.find(data)
        rval = self.buff[:pos + len(data)]
        self.buff = self.buff[pos + len(data):]
 
        return rval
 
    def write(self, data):
        print(data)
        self.socket.send(data)
    
    def sendline(self, text):
        print(text)
        self.socket.send(bytes((text) + '\n', 'utf-8'))
    
    def close(self):

        self.socket.close()

def solve(score):
    score = score.replace('love', '0')
    score = score.replace('game', '45')
    score = score.replace('set', '6')
    l, r = map(int,score.split('-'))
    if l > r:
        return '0'
    else:
        return '1'

n = Netcat('arthurashe.ctf.umbccd.io', 8411)
data = n.readtext()
n.sendline('Y')
data = n.readtext()
txt = ''
while 'result' in data:
    print(data)
    before, after = data.index(' is ') + len(' is '),data.index('.',data.index(' is '))
    score = data[before:after]

    out = solve(score)
    txt += out

    n.sendline(out)
    data = n.readtext()

print(data)
data = n.readtext()
print(txt)
n.close()
{% endhighlight %}

# Man these spot the difference games are getting hard
There isn't much to say then that the server sents encoded text with several different encryption methods. I wrote code to check each one and determine the flag.

{% highlight python %}
import socket
 
class Netcat:

    """ Python 'netcat like' module """

    def __init__(self, ip, port):

        self.buff = ""
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((ip, port))

    def read(self, length = 1024):

        """ Read 1024 bytes off the socket """

        return self.socket.recv(length)
    
    def readtext(self, length = 1024):

        """ Read 1024 bytes off the socket and returns decoded text as string """

        return self.socket.recv(length).decode('utf-8')
 
    def read_until(self, data):

        """ Read data into the buffer until we have data """

        while not data in self.buff:
            self.buff += self.socket.recv(1024)
 
        pos = self.buff.find(data)
        rval = self.buff[:pos + len(data)]
        self.buff = self.buff[pos + len(data):]
 
        return rval
 
    def write(self, data):
        print(data)
        self.socket.send(data)
    
    def sendline(self, text):
        print(text)
        self.socket.send(bytes((text) + '\n', 'utf-8'))
    
    def close(self):

        self.socket.close()

def solve(score):
    score = score.replace('love', '0')
    score = score.replace('game', '45')
    score = score.replace('set', '6')
    l, r = map(int,score.split('-'))
    if l > r:
        return '0'
    else:
        return '1'

n = Netcat('arthurashe.ctf.umbccd.io', 8411)
data = n.readtext()
n.sendline('Y')
data = n.readtext()
txt = ''
while 'result' in data:
    print(data)
    before, after = data.index(' is ') + len(' is '),data.index('.',data.index(' is '))
    score = data[before:after]

    out = solve(score)
    txt += out

    n.sendline(out)
    data = n.readtext()

print(data)
data = n.readtext()
print(txt)
n.close()
{% endhighlight %}

All I had to do was to decode the binary output through an online converter to get the flag.

## Forensics
Below is the only one I enjoyed

# Benford's Law Firm, LLC
[Benford's Law][Benford-Law] describes frequencies associated with leading numbers. And I was given many CSV files to analyze for any anomalous activities.

![Benford's Law frequency distribution](/assets/images/DawgCTF/benford.png)

Using the [Wikipedia page][Benford-Law] I was able to make a script to analyze all the files given and return with the one that was least compliant with Benford's Law, suggesting that there have been some anomalous activities.

{% highlight python %}
import csv
import os 
import math as m

def getExpected(total): # https://towardsdatascience.com/frawd-detection-using-benfords-law-python-code-9db8db474cf8
    return [round(p * total / 100) for p in BENFORD]


kLISTLENGTH = 19 # 19 items per iterable (onsite,remote,etc.)
BENFORD = [30.1, 17.6, 12.5, 9.7, 7.9, 6.7, 5.8, 5.1, 4.6] # https://towardsdatascience.com/frawd-detection-using-benfords-law-python-code-9db8db474cf8
expected_counts = getExpected(kLISTLENGTH)

best_one = 0
def chi_square_test(data_count,expected_counts): # https://towardsdatascience.com/frawd-detection-using-benfords-law-python-code-9db8db474cf8
    global best_one
    """Return boolean on chi-square test (8 degrees of freedom & P-val=0.05)."""
    chi_square_stat = 0  # chi square test statistic
    for data, expected in zip(data_count,expected_counts):

        chi_square = m.pow(data - expected, 2)

        chi_square_stat += chi_square / expected
    if(chi_square_stat > best_one):
        best_one = chi_square_stat
        pass
    else:
        return False
    print('-'*50)
    print("Chi-squared Test Statistic = {:.3f}".format(chi_square_stat))
    print("Critical value at a P-value of 0.05 is 15.51.")    
    return chi_square_stat > 15.51


def getLis(arr):
    lis = []
    for x in arr:
        for y in x:
            if '$' in y:
                lis.append(y[1:])
    return lis

dict_template = {
    'one': 0,
    'two': 0,
    'three': 0,
    'four': 0,
    'five': 0,
    'six': 0,
    'seven': 0,
    'eight': 0,
    'nine': 0
}

def reset(dic):
    new = {}
    for k, v in dic.items():
        new[k] = 0
    return new


for dire in os.listdir(os.getcwd()+'\data'):
    with open('data/'+dire,newline='') as csvfile:
        r = csv.reader(csvfile)
        arr = list(r)

    onsite = arr[arr.index(['Onsite']):arr.index(['Remote'])]
    remote = arr[arr.index(['Remote']):arr.index(['Outsourced'])]
    outsou = arr[arr.index(['Outsourced']):arr.index(['Deductible'])]
    deduct = arr[arr.index(['Deductible']):]

    irr = [onsite,remote,outsou,deduct]

    dict_template = reset(dict_template)
    for arr in irr:
        lis = getLis(arr)
        #https://en.wikipedia.org/wiki/Benford%27s_law
        for num in lis:
            if(num[:1] == '1'):
                dict_template['one'] += 1
            if(num[:1] == '2'):
                dict_template['two'] += 1
            if(num[:1] == '3'):
                dict_template['three'] += 1
            if(num[:1] == '4'):
                dict_template['four'] += 1
            if(num[:1] == '5'):
                dict_template['five'] += 1
            if(num[:1] == '6'):
                dict_template['six'] += 1
            if(num[:1] == '7'):
                dict_template['seven'] += 1
            if(num[:1] == '8'):
                dict_template['eight'] += 1
            if(num[:1] == '9'):
                dict_template['nine'] += 1
        data_count = []
        for k, v in dict_template.items():
            data_count.append(v)
        if(chi_square_test(data_count,expected_counts)):
            print(dire, '\n\n', dict_template)
#=> --------------------------------------------------
#=> Chi-squared Test Statistic = 371.000
#=> DawgCTF{L3g@lly_D1s7ribu73d_St@t1st1c5_641}.csv
#=> 
#=> {'one': 5, 'two': 5, 'three': 10, 'four': 7, 'five': 12, 'six': 10, 'seven': 9, 'eight': 10, 'nine': 8}
{% endhighlight %}

## Overall thoughts
fun.

[Netcat-Library-github]: https://gist.github.com/leonjza/f35a7252babdf77c8421
[Benford-Law]: https://en.wikipedia.org/wiki/Benford%27s_law