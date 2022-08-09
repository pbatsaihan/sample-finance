// Дэлгэцтэй ажиллах контролер
var uiController = (function () {})();

// Санхүүгийн контролер
var financeController = (function () {})();

// Програм холбогч контролер
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    // 1.Оруулах өгөгдлийг олж авна
    // 2. Олж авсан өгөгдлүүдийг санхүүгийн контролор руу дамжуулж тэнд хадгалана.
    // 3. Олж авсан өгөгдлүүдийг вэб дээр тохирох хэсэгт гаргана
    // 4. Төсвийг тооцоолно.
    // 5. Эцсийн үлдэгдэл тооцоолж дэлгэцэнд гаргана.
    console.log("Дэлгэцээс өгөгдөл авах хэсэг");
  };

  document.querySelector(".add__btn").addEventListener("click", function () {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(uiController, financeController);
