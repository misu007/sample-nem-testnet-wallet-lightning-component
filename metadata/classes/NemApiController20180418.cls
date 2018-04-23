global class NemApiController20180418 {
    
    private static String nis = 'https://nem-nis-demo.herokuapp.com';
    
    global static String generateWallet(){
        return query('/wallet/new', null);
    }
    global static String getAccount(String address){
        Map<String, String> queryData = new Map<String, String>();
        queryData.put('fmtAddress', address);
        return query('/wallet', queryData);
    }
    global static String getIncomings(String address){
        Map<String, String> queryData = new Map<String, String>();
        queryData.put('fmtAddress', address);
        return query('/trans/incoming', queryData);
    }
    global static String getOutgoings(String address){
        Map<String, String> queryData = new Map<String, String>();
        queryData.put('fmtAddress', address);
        return query('/trans/outgoing', queryData);
    }
    global static String getUnconfirmeds(String address){
        Map<String, String> queryData = new Map<String, String>();
        queryData.put('fmtAddress', address);
        return query('/trans/unconfirmed', queryData);
    }
    global static String send(String walletData, String recipient, String amount, String message){
        Map<String, String> queryData = new Map<String, String>();
        queryData.put('walletData', walletData);
        queryData.put('recipient', recipient);
        queryData.put('amount', amount);
        queryData.put('message', message);
        return query('/send', queryData);
    }
    
    private static String query(String query, Map<String, String> queryData){
        try{
            String endpoint = nis + query;
            if (queryData != null && queryData.size() > 0){
                List<String> queryList = new List<String>();
                for (String queryKey : queryData.keySet()){
                    queryList.add(queryKey + '=' + EncodingUtil.urlEncode(queryData.get(queryKey), 'UTF-8'));
                }
                endpoint += '?' + String.join(queryList, '&');
            }
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            Http http = new Http();
            HTTPResponse res = http.send(req);
            return res.getBody();
        } catch(Exception ex){
            return 'ERROR:' + ex.getMessage();
        }
    }
    
    
}