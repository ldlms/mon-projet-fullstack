export const ROUTES = [
    {
        url:"/users",
        auth:false,
        proxy: {
            target:"http://user-service:5001",
            changeOrigin:true,
            pathRewrite: {'^/user' : ''},
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