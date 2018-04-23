global without sharing class NemWalletController20180418 {
    
    @AuraEnabled
    global static String aGetAccount(){
        User me = getMe();
        if (me.NEM_Address_Testnet__c != null && me.NEM_Address_Testnet__c.length() > 20){
            
        } else {
            String res = NemApiController20180418.generateWallet();
            Map<String, Object> jmap = (Map<String, Object>) JSON.deserializeUntyped(res);
            me.NEM_Address_Testnet__c = String.valueOf(jmap.get('fmtAddress'));
            me.NEM_PKEY_Testnet__c = String.valueOf(jmap.get('walletData'));
            update me;
        }
     	return NemApiController20180418.getAccount(me.NEM_Address_Testnet__c);
    }
    
    @AuraEnabled
    global static String aGetIncomingTransactions(){
        User me = getMe();
     	return NemApiController20180418.getIncomings(me.NEM_Address_Testnet__c);
    }
    
    @AuraEnabled
    global static String aGetOutgoingTransactions(){
        User me = getMe();
     	return NemApiController20180418.getOutgoings(me.NEM_Address_Testnet__c);
    }
    
    @AuraEnabled
    global static String aGetUnconfirmedTransactions(){
        User me = getMe();
     	return NemApiController20180418.getUnconfirmeds(me.NEM_Address_Testnet__c);
    }

    @AuraEnabled
    global static String aSendToken(String recipient, String amount, String message){
     	User me = getMe();
        return NemApiController20180418.send(me.NEM_PKEY_Testnet__c, recipient, amount, message);
    }
    
    private static User getMe(){
        return [SELECT Id, NEM_Address_Testnet__c, NEM_PKEY_Testnet__c FROM User WHERE Id=:UserInfo.getUserId()];
    }
}