import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEstimatorTracker, estimatorParameters } from './estimatorAnalytics.ts';
const initial = {step:0, demolition:null, pattern:'', material:'', color:'warm-white', method:'measure', area:null};
test('views deduplicate on rerenders; selections and forward/back paths retain context', () => {
  const events=[]; let time=0;
  const tracker=createEstimatorTracker((name,p)=>events.push({name,...p}),()=>time);
  tracker.update(initial); tracker.update({...initial});
  assert.deepEqual(events.map(e=>e.name),['estimator_open','estimator_step_view']);
  tracker.update({...initial,color:'sage'});
  assert.equal(events.filter(e=>e.name==='estimator_start').length,1);
  time=5000; tracker.update({...initial,color:'sage',step:1});
  assert.equal(events.find(e=>e.name==='estimator_step_complete').step_duration_seconds,5);
  tracker.update({...initial,color:'sage',step:0});
  assert.equal(events.at(-2).name,'estimator_back');
});
test('hidden tabs do not count toward step time or cause abandonment', () => {
  const events=[]; let time=0;
  const tracker=createEstimatorTracker((name,p)=>events.push({name,...p}),()=>time);
  tracker.update(initial); time=2000; tracker.visibility(false);
  time=62000; tracker.visibility(true); time=65000; tracker.exit(); tracker.exit();
  assert.equal(events.filter(e=>e.name==='estimator_exit').length,1);
  assert.equal(events.at(-1).step_duration_seconds,5);
  assert.equal(events.at(-1).quote_submitted,false);
});
test('results and successful quotes include selected preferences; failed attempts do not count as success', () => {
  const events=[]; const tracker=createEstimatorTracker((name,p)=>events.push({name,...p}));
  tracker.update({...initial,step:3,material:'Glass',pattern:'Herringbone',color:'sage'});
  tracker.update({...initial,step:4,material:'Glass',pattern:'Herringbone',color:'sage',area:35});
  assert.equal(events.find(e=>e.name==='estimator_result_view').tile_material,'Glass');
  tracker.quote('attempt'); tracker.quote('error'); tracker.exit();
  assert.equal(events.at(-1).quote_submitted,false);
  tracker.resume(); tracker.quote('success'); tracker.exit();
  assert.equal(events.at(-1).quote_submitted,true);
});
test('analytics excludes arbitrary fields and exact dimensions', () => {
  const params=estimatorParameters({...initial,area:15.8,name:'Private',email:'private@example.com',phone:'123',zip:'28202'});
  assert.equal(params.area_band,'under_20');
  for(const key of ['name','email','phone','zip','area']) assert.equal(key in params,false);
});
