$(document).ready(async () => {    
  const button = document.getElementById("sign_in");
  const sign_in_form = document.getElementById("form_sign_in");
  document.getElementById("login-false").style.display = "none";
  document.getElementById("login-exist").style.display = "none";
  button.addEventListener("click", event => {
   
    event.preventDefault();
   
    if(sign_in_form.elements.namedItem("user").value==''){
      window.alert('Bạn chưa nhập tài khoản!');
    }
    else   if(sign_in_form.elements.namedItem("pass").value==''){
      window.alert('Bạn chưa nhập mật khẩu!');
    }
    else
    $.ajax({
      url: "/users/sign-in",
      type: "post",
      data: {
        user: sign_in_form.elements.namedItem("user").value,
        password: sign_in_form.elements.namedItem("pass").value
      },
      success: async data => {
        
        if (!data.isExist){
          document.getElementById("login-exist").style.display = "block";
        }
        else if (data.ok == false)
          document.getElementById("login-false").style.display = "block";
        else {
          await swal(
            "Đăng nhập thành công!",
            "Click OK để trở về trang chủ!",
            "success",
            { button: "Đi nào" }
          );
          window.location.href = data.url;
        }
      }
    });
    sign_in_form.addEventListener("input", () => {
      document.getElementById("login-false").style.display = "none";
      document.getElementById("login-exist").style.display = "none";
    });
  });
  document.getElementById("forget").addEventListener("click", async event => {
    event.preventDefault();
    await swal("Nhập email đã đăng ký của bạn", {
      content: "input"
    }).then(value => {
      if(value=="") swal("Quên mật khẩu", `Vui lòng nhập thông tin`, "error");
      else 
      $.ajax({
        url: "/users/forget-password",
        type: "post",
        async: false,
        data: { user: value },
        success: data => {
          if (data == "false")
            swal("Quên mật khẩu", `Tài khoản không tồn tại`, "error");
          else
            swal(
              "Quên mật khẩu",
              `Vui lòng truy cập ${data} để lấy lại mật khẩu`,
              "success"
            );
        }
      });
    });
  });
});
