"""Local integration tests. Run as projectchat before the widget is deployed."""
import json, uuid, unittest
from urllib.request import Request,urlopen
from urllib.error import HTTPError
import psycopg2
BASE='http://127.0.0.1:8765/api/project-chat/'
IDS=[]
def post(path,body,ip='test-http',host='vadconstructions.com',origin=None):
    req=Request(BASE+path,data=json.dumps(body).encode(),headers={'Content-Type':'application/json','X-Forwarded-Host':host,'Origin':origin or 'https://'+host,'X-Real-IP':ip})
    try:
        with urlopen(req,timeout=5) as response: return response.status,json.load(response)
    except HTTPError as error:return error.code,json.load(error)
def session(ip='test-http',host='vadconstructions.com'):
    code,data=post('session',{'consent':True},ip,host)
    assert code==200,(code,data)
    IDS.append(data['reference'])
    return data['token']
class Tests(unittest.TestCase):
    def test_01_consent_origin_and_brand(self):
        self.assertEqual(post('session',{'consent':False})[0],400)
        self.assertEqual(post('session',{'consent':True},origin='https://example.com')[0],403)
        self.assertEqual(post('session',{'consent':True},host='example.com')[0],403)
    def test_02_answers_and_tokens(self):
        token=session('test-topic')
        self.assertEqual(post('message',{'token':token,'message':'Topic: price','topic':'price'},'test-topic')[0],200)
        code,data=post('message',{'token':token,'message':'write a poem about tile'},'test-topic')
        self.assertEqual(code,200);self.assertIn('choose a project topic',data['answer'])
        self.assertEqual(post('message',{'token':token+'x','message':'price'},'test-topic')[0],400)
        self.assertEqual(post('message',{'token':token,'message':'price'},'test-topic','queencitybacksplash.com')[0],400)
        self.assertEqual(post('message',{'token':token,'message':'x'*601},'test-topic')[0],400)
    def test_03_turn_limit(self):
        token=session('test-turns')
        for i in range(20):self.assertEqual(post('message',{'token':token,'message':'Topic: contact','topic':'contact'},'test-turn-'+str(i))[0],200)
        self.assertEqual(post('message',{'token':token,'message':'price'},'test-turn-over')[0],429)
    def test_04_throttle(self):
        results=[post('session',{'consent':False},'test-burst')[0] for i in range(9)]
        self.assertEqual(results[-1],429)
    def test_05_qcb_facts(self):
        token=session('test-qcb','queencitybacksplash.com')
        code,data=post('message',{'token':token,'message':'Topic: price','topic':'price'},'test-qcb','queencitybacksplash.com')
        self.assertEqual(code,200);self.assertIn('$1,048',data['answer'])
try:
    result=unittest.main(exit=False).result
finally:
    conn=psycopg2.connect('dbname=projectchat user=projectchat host=/var/run/postgresql')
    with conn.cursor() as cur:
        for cid in IDS:cur.execute('DELETE FROM conversations WHERE id=%s',(cid,))
        # Run before launch only; removes test throttle counters.
        cur.execute('DELETE FROM throttle')
    conn.commit();conn.close()
if not result.wasSuccessful():raise SystemExit(1)
