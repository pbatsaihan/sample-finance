// Дэлгэцтэй ажиллах контролер
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// Санхүүгийн контролер
var financeController = (function () {})();

// Програм холбогч контролер
var appController = (function (uiController, financeController) {
  var DOM = uiController.getDOMstrings();

  var ctrlAddItem = function () {
    // 1.Оруулах өгөгдлийг олж авна
    console.log(uiController.getInput());
    // 2. Олж авсан өгөгдлүүдийг санхүүгийн контролор руу дамжуулж тэнд хадгалана.
    // 3. Олж авсан өгөгдлүүдийг вэб дээр тохирох хэсэгт гаргана
    // 4. Төсвийг тооцоолно.
    // 5. Эцсийн үлдэгдэл тооцоолж дэлгэцэнд гаргана.
  };

  document.querySelector(DOM.addBtn).addEventListener("click", function () {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(uiController, financeController);
