({
    initParams : function(cmp, evt, helper){
        cmp.set('v.w_info', {
            balance : '---'
        });
        cmp.set('v.modalClass', {
            send : 'close',
            receive : 'close',
            conf : 'close'
        });
        cmp.set('v.confTabClass', {
            node : 'open',
            wallet : 'close'
        });
        cmp.set('v.mainClass', {
            page0 : 'close',
            page1 : 'open'
        });
        cmp.set('v.sendToken', {
            distination : '',
            message: '',
            amount : 0,
            fee : 0,
            total : 0
        });        
    },
    reloadInit : function (cmp, evt, helper, silentMode){
        if(silentMode == false){
            cmp.set('v.loadingClass', 'on');
            cmp.set('v.w_info', {
                balance : '---'
            });
            cmp.set('v.in_transactions', []);
            cmp.set('v.out_transactions', []);
        }
        helper.getAccount(cmp, evt, helper, null);
        helper.getAllTransactions(cmp, evt, helper);
    },
    sendToken : function(cmp, evt, helper){
        var tran = cmp.get("v.sendToken");
        var action = cmp.get("c.aSendToken");
        action.setParams({
            recipient : tran.recipient,
            amount : tran.amount,
            message : tran.message
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                var ret = response.getReturnValue();
                console.log(ret);
                helper.changeModalClass(cmp, null);
                helper.reloadInit(cmp, evt, helper, true);
            }
        });
        $A.enqueueAction(action);        
    },
    getAccount : function(cmp, evt, helper, callback) {
        var action = cmp.get("c.aGetAccount");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                var ret = response.getReturnValue();
                console.log(ret);
                if (callback){
                    callback(cmp, evt, helper, ret);
                }
                var jsono = JSON.parse(ret);                
                if (jsono && jsono.account){
                    var wi = cmp.get('v.w_info');
                    wi.address = jsono.account.address;
                    wi.fmtAddress = helper.convertToFmtAddress(jsono.account.address);
                    wi.balance = (jsono.account.balance / 1000000).toString();
                    cmp.set('v.w_info', wi);
                }                
                cmp.set('v.loadingClass', 'off');
            }
        });
        $A.enqueueAction(action);
    },
    getAllTransactions : function (cmp, evt, helper){
        helper.getTransactions('unconfirmed', cmp, evt, helper, null);
        helper.getTransactions('incoming', cmp, evt, helper, null);	
        helper.getTransactions('outgoing', cmp, evt, helper, null);
    },    
    getTransactions : function(type, cmp, evt, helper, callback) {        
        var action = 
            type == 'incoming' ? cmp.get("c.aGetIncomingTransactions"):
        type == 'outgoing' ? cmp.get("c.aGetOutgoingTransactions"):
        cmp.get("c.aGetUnconfirmedTransactions");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                var ret = response.getReturnValue();
                if (callback) callback(cmp, evt, helper, ret);
                var jsono = JSON.parse(ret);
                var trans = [];
                var datas = jsono.data;
                for (var i=0; i<datas.length; i++){
                    var data = datas[i];
                    var when = new Date( (data.transaction.timeStamp + 1427587585) * 1000 );
                    var obj = {
                        amount: data.transaction.amount / 1000000,
                        when: when,
                        fee: data.transaction.fee / 1000000,
                        total: (data.transaction.amount + data.transaction.fee) / 1000000,
                        sender: helper.convertToFmtAddress(data.transaction.sender),
                        reipient: helper.convertToFmtAddress(data.transaction.recipient),
                        ifmessage: false
                    };  
                    if (data.transaction.message && data.transaction.message.payload){
                        obj.message = helper.convertHexToString(data.transaction.message.payload);
                        obj.ifmessage = true;
                    }
                    if (type == 'incoming' || type == 'outgoing'){
                        obj.hash = data.meta.hash.data;
                    }
                    trans.push(obj);
                }
                if (type == 'unconfirmed'){
                    var unconfirmed = cmp.get('v.unconfirmed');                        
                    if (datas.length > 0){
                        if (unconfirmed == false){
                            $A.get("e.force:showToast").setParams({
                                'mode' : 'pester',
                                'message' : 'Transactions are processing..',
                                'key' : 'info'
                            }).fire();
                        }
                        cmp.set('v.unconfirmed', true);
                    } else {
                        if (unconfirmed == true){
                            $A.get("e.force:showToast").setParams({
                                'type' : 'success',
                                'mode' : 'pester',
                                'message' : 'Transactions complete',
                                'key' : 'info'
                            }).fire();
                        }
                        cmp.set('v.unconfirmed', false);
                    }
                }
                var output = 
                    type == 'incoming' ? 'v.in_transactions':
                type == 'outgoing' ? 'v.out_transactions':
                'v.un_transactions';
                cmp.set(output, trans);                
            }
        });
        $A.enqueueAction(action);
    },
    createNewWallet : function(cmp, evt, helper, callback) {
        helper.changeConfTab(cmp, 'wallet');
        helper.changeModalClass(cmp, 'conf');
    },
    
    changeModalClass : function(cmp, target){
        var modalClass = cmp.get('v.modalClass');
        for (var key in modalClass){
            if (target && target.length > 0 && target == key){
                modalClass[key] = 'open';
            } else {
                modalClass[key] = 'close';
            }
        }
        cmp.set('v.modalClass', modalClass);
    },
    changeConfTab : function(cmp, target){
        var confTabClass = cmp.get('v.confTabClass');
        for (var key in confTabClass){
            if (target && target.length > 0 && target == key){
                confTabClass[key] = 'open';
            } else {
                confTabClass[key] = 'close';
            }
        }
        cmp.set('v.confTabClass', confTabClass);
    },
    calcSendFee: function(cmp, evt, helper){
        var sendToken = cmp.get('v.sendToken');
        var amount = Number(sendToken.amount) || 0;
        var fee = Math.ceil(amount / 10000) * 0.05;
        if (fee > 1.25) fee = 1.25;
        if (sendToken.message.length > 0) fee += Math.ceil(sendToken.message.length / 32) * 0.05;
        sendToken.fee = fee;
        sendToken.total = fee + amount;
        cmp.set('v.sendToken', sendToken);
    },
    convertToFmtAddress: function(str){
        return str.replace(/^(.{5})(.{5})(.{5})(.{5})(.{5})(.{5})(.{5})(.{5})$/, '$1-$2-$3-$4-$5-$6-$7-$8');
    },
    convertHexToString: function(hexStr){
        var	arr = [];
        for (var i = 0; i < hexStr.length; i+=2) {
            arr.push(parseInt(hexStr.substr(i,2), 16));
        }
        if (arr == null) return null;
        var result = "";
        var i;
        while (i = arr.shift()) {
            if (i <= 0x7f) {
                result += String.fromCharCode(i);
            } else if (i <= 0xdf) {
                var c = ((i&0x1f)<<6);
                c += arr.shift()&0x3f;
                result += String.fromCharCode(c);
            } else if (i <= 0xe0) {
                var c = ((arr.shift()&0x1f)<<6)|0x0800;
                c += arr.shift()&0x3f;
                result += String.fromCharCode(c);
            } else {
                var c = ((i&0x0f)<<12);
                c += (arr.shift()&0x3f)<<6;
                c += arr.shift() & 0x3f;
                result += String.fromCharCode(c);
            }
        }
        return result;
    }    
})