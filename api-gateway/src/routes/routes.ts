export const ROUTES = [
    {
        url:"/users/test",
        auth:false,
        proxy: {
            target:"http://user-service:5001/test",
            changeOrigin:true,
            pathRewrite: {'^/users/test' : ''},
        }, 
    },
    {
        url:"/cards",
        auth:false,
        proxy: {
            target:"http://card-service:5002",
            changeOrigin:true,
            pathRewrite: {'^/card' : ''},
        },
    },
]