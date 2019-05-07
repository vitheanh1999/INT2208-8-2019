$(document).ready(async () => {
  const button = document.getElementById("conform");
  const sign_in_form = document.getElementById("form_reset");
  document.getElementById("repeat-false").style.display = "none";
  sign_in_form.addEventListener("input", () => {
    document.getElementById("repeat-false").style.display = "none";
  });
  button.addEventListener("click", event => {
    event.preventDefault();
    let check = true;
    if (
      sign_in_form.elements.namedItem("pass").value !=
      sign_in_form.elements.namedItem("pass-repeat").value
    )
      check = false;
    if (check == false)
      document.getElementById("repeat-false").style.display = "block";
    else {
      const id = window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];
      $.ajax({
        url: `/users/repass/${id}`,
        type: "post",
        async: false,
        data: {
          pass: sign_in_form.elements.namedItem("pass").value
        },
        success:async data => {
          await swal({
            text: "Thay đổi mật khẩu thành công",
            icon: "success",
            button : "OK"
          });
          window.location.href = data.url;
        }
      });
    }
  });
});
