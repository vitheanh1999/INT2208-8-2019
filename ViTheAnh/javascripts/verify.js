$(document).ready(async () => {
  const id = window.location.href.split("/")[
    window.location.href.split("/").length - 1
  ];
  $.ajax({
    url: `/users/verify/${id}`,
    type: "post",
    success: async data => {
      await swal({
        text: "Verify email success ",
        icon: "success",
        button: "OK"
      });
      window.location.href = data.url;
    }
  });
});
