```js
const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const fromData = new FormData(e.currentTarget)
        setLogIn("loading ...")
        const email = fromData.get("email")
        const password = fromData.get("password")
        const loginData = { email, password }

        const { data, error } = await loginFun(loginData)

        if (error) {
            ShowToastify({ error: "Check your password or email address" })
            setLogIn("Log in")
        }
        if (data) {
            console.log(data);
            
            if (data?.data?.role != "SUPERADMIN") {
                ShowToastify({ error: "You are not authorize" })
                setLogIn("Log in")
                dispatch(logOut())
                return
            }
            dispatch(setUser({ name: data?.data?.name, role: data?.data?.role }))
            Cookies.set("accessToken", data?.data?.accessToken)
            route.push("/")
        }
    }
```