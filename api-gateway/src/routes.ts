export const ROUTES = [
    {
        url:"/users",
        auth:false,
        proxy: {
            target:"http://user-service:5001",
            changeOrigin:true,
            pathRewrite: {'^/users' : ''},
        }, 
    },
    {
        url:"/cv",
        auth:false,
        proxy: {
            target:"http://cv-service:5002",
            changeOrigin:true,
            pathRewrite: {'^/cv' : ''},
        },
    },
]