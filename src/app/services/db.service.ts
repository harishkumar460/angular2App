import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  recordCounter: number = 0;
  isRecordsInserted: Array<any> = [];
  isMultiRecords: boolean;
  dataSet: Array<any>= [];
  indexedDB: any;
  constructor() { }

  storeInfo(key: string, data: any) {
		if (data && data.length) {
		    data = JSON.stringify(data);
		    localStorage.setItem(key, data);
		} else {
      localStorage.removeItem(key);
		}
  }
  getInfo(key: string) {
		const data = JSON.parse(localStorage.getItem(key));
		return data;
  }
  
  createDatabase() {
    const request = window.indexedDB.open('expenseDB', 4.1);
    request.onupgradeneeded = (event) => {
      var db = request.result;
      var objectStore = this.manageObjectStore(db,'',false);
      objectStore.transaction.oncomplete = ()=> {
		 // plugins.showToast('Database created!'); 
		 console.log('Database created!');
      }
    } 
  }

  manageObjectStore(db,action,dbExist) {
		let objectStore;
		if (dbExist && db.objectStoreNames.contains('expenses')) {
		objectStore = db.transaction(['expenses']).objectStore('expenses');
		}
		else {
		  objectStore = db.createObjectStore('expenses', {
		    keyPath : 'date'
		});
		objectStore.createIndex('month_year', 'month_year', {
		    unique : false
		});
		objectStore.createIndex('year', 'year', {
		    unique : false
		});
		console.log('======New Index created');
		}
		return objectStore;
	}

  openIndexDB(data,options,callback) {
		this.indexedDB = window.indexedDB;
		const request = window.indexedDB.open('expenseDB', 4.1);
		request.onsuccess =(event) => {
		  this.processTransaction(event,data,options,true,callback);
		}
  }

  processTransaction(event,data,options,dbExist,callback) {
		let db = event.target.result;
		this.isMultiRecords=false;
		this.recordCounter=0;
		this.isRecordsInserted=[];
		this.dataSet=[];
		console.log('options '+JSON.stringify(options));
		var action=options.action,transaction,objectStore;
		if(action==='readwrite'){
		  transaction=db.transaction(["expenses"],action);
		  objectStore = transaction.objectStore("expenses");
		  if(data && data.length>0){
		    this.isMultiRecords=true;
		    this.dataSet=data;
		    console.log('data is an array '+data);
		    this.checkRecordExist(data[this.recordCounter],objectStore,callback);
		  }else{
		      console.log('data is an single object '+data);
		   this.checkRecordExist(data,objectStore,callback);   
		  }
		}else{
		      transaction=db.transaction(["expenses"]);
			objectStore = transaction.objectStore("expenses");
		      this.fetchInfo(data,objectStore,options.searchBy,callback);    
		  }
  }
  
  checkRecordExist(data,objectStore,callback) {
		console.log('data record '+JSON.stringify(data));
		const request = objectStore.get(data.date);
		
		request.onsuccess = function(event) {
		    const requestUpdate = data.totalAmount?objectStore.put(data):objectStore.delete(data.date);
		    requestUpdate.onerror = (event) => {
			this.recordsStatusHandler(callback,false,objectStore);
		    };
		    requestUpdate.onsuccess = (event)=> {
			this.recordsStatusHandler(callback,true,objectStore); 
		    };
		};
		request.onerror = (event)=> {
		    const addRequest=objectStore.add(data);
		    addRequest.onsuccess=function(){
			this.recordsStatusHandler(callback,true,objectStore);  
		      };
		      addRequest.onerror=function(){
		       this.recordsStatusHandler(callback,false,objectStore);  
		      }; 
		};
  }
  
  recordsStatusHandler(callback,recordStatus,objectStore) {
		if (this.isMultiRecords) {
		     if(!recordStatus){
	         this.isRecordsInserted.push(this.recordCounter);
		     }
		     this.recordCounter++;
		     if(this.recordCounter<this.dataSet.length){
		      this.checkRecordExist(this.dataSet[this.recordCounter],objectStore,callback);
		     }else{
			 const finalStatus=(this.isRecordsInserted.length===0);
			 callback(finalStatus,this.isRecordsInserted); 
		     }
		     
		  }else{
		    callback(recordStatus);  
		  }
  }
  
  fetchInfo(data,objectStore,searchBy,callback) {
    let successHandler;
    let resultSet = [],cursor;
		if (searchBy === 'key') {
		  const request = objectStore.get(data);
		  request.onerror = function(event) {
			  callback(false,'');
		  };
		  request.onsuccess = function(event) {
		   // Do something with the request.result!
		   console.log(request.result?"Fetched data is " + JSON.stringify(request.result):'');
		   callback(true,request.result);
		  }  
		}else {
		    const indexKey=data.indexOf('_')>=0?'month_year':'year';
		    console.log('indexKey '+indexKey);
		    const index = objectStore.index(indexKey);
		    console.log('in index flow '+data+'*************');
		    var singleKeyRange = IDBKeyRange.only(data);
		    index.openCursor(singleKeyRange).onsuccess = successHandler;
		}
		
		successHandler = (event) => {
		     cursor = event.target.result;
		  if (cursor) {
		    resultSet.push(cursor.value);
		    cursor.continue();
		  }else {
		      callback(true,resultSet); 
		  }
		}
	}
  
}
