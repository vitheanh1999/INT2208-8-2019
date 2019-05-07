$(document).ready(() => {
  const button = document.getElementById("sign_up");
  const clear = document.getElementById("clear");
  const input = document.getElementsByClassName("form-control");
  const checkvalid = document.getElementsByClassName("check");
  const checked = document.getElementsByClassName("checked");
  Array.from(checkvalid).forEach(item => {
    item.style.display = "none";
  });
  Array.from(input).forEach(input => {
    input.value = "";
  });
  Array.from(input).forEach(input => {
    input.addEventListener("input", () => {
      Array.from(checkvalid).forEach(item => {
        item.style.display = "none";
      });
      Array.from(checked).forEach(item => {
        item.style.display = "inline";
      });
    });
  });
  Array.from(input).forEach(input => {
    input.addEventListener("change", () => {
      Array.from(checkvalid).forEach(item => {
        item.style.display = "none";
      });
      Array.from(checked).forEach(item => {
        item.style.display = "none";
      });
      $.ajax({
        url: "/users/sign-up/checkvalid",
        type: "post",
        data: {
          checkInfo: input.value,
          type: input.name
        },
        success: data => {
          if (data.type === "repass") {
            if (
              document.getElementsByClassName("form-control").repass.value !=
              document.getElementsByClassName("form-control").password.value
            )
              data.isValid = false;
          }
          if (data.isNull == true)
            document.getElementById(`${data.type}null`).style.display =
              "inline";
          else if (data.isExist == true) {
            document.getElementById(`${data.type}exist`).style.display =
              "inline";
          } else if (data.isValid == true) {
            document.getElementById(`${data.type}yes`).style.display = "inline";
            document.getElementById(`${data.type}yes`).classList.add("checked");
          } else if (data.isValid == false) {
            document.getElementById(`${data.type}no`).style.display = "inline";
            document
              .getElementById(`${data.type}yes`)
              .classList.remove("checked");
          }
        }
      });
    });
  });
  clear.addEventListener("click", event => {
    event.preventDefault();
    Array.from(checkvalid).forEach(item => {
      item.style.display = "none";
    });
    Array.from(checked).forEach(item => {
      item.style.display = "none";
    });
    Array.from(input).forEach(input => {
      input.value = "";
    });
  });
  button.addEventListener("click", event => {
    event.preventDefault();
    if (checked.length < 6)
      document.getElementById("miss").style.display = "block";
    else
      $.ajax({
        url: "/users/sign-up",
        type: "post",
        data: {
          user: input.user.value,
          contact: input.contact.value,
          email: input.email.value,
          password: input.password.value,
          adress: input.adress.value
        },
        success: async data => {
          await swal(
            "Đăng ký thành công!",
            "Click OK để trở về trang chủ!",
            "success",
            { button: "Đi nào" }
          );
          window.location.href = data.url;
        }
      });
  });
});
