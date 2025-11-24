export const ROUTES = [
    {
        url:"/users",
        auth:false,
        proxy: {
            target:"http://localhost:50001",
            changeOrigin:true,
            pathRewrite: {'^/users' : ''},
        }, 
    },
    {
        url:"/cv",
        auth:false,
        proxy: {
            target:"http://localhost:50002",
            changeOrigin:true,
            pathRewrite: {'^/cv' : ''},
        },
    },
]