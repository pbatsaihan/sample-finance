// **************************************************************************
// Дэлгэцтэй ажиллах контролер
// **************************************************************************
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    balanceValue: ".budget__value",
    incomeValue: ".budget__income--value",
    expenseValue: ".budget__expenses--value",
    percentageValue: ".budget__expenses--percentage",
    containerDiv: ".container",
    expPercentageValue: ".item__percentage",
  };

  var nodeListForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    displayPercentages: function (allPercentages) {
      // Зарлагын NodeList-ийг олох
      var elements = document.querySelectorAll(DOMstrings.expPercentageValue);

      // elements болгоны хувьд зарлагын хувийг массиваас авч оруулах
      nodeListForeach(elements, function (el, index) {
        el.textContent = allPercentages[index];
      });
    },

    getDOMstrings: function () {
      return DOMstrings;
    },

    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (el, index, array) {
        el.value = "";
      });

      // Курсор байрлах буюу идэвхтэй талбарыг заана.
      fieldsArr[0].focus();
    },

    seeBalance: function (balance) {
      document.querySelector(DOMstrings.balanceValue).textContent =
        balance.balance;
      document.querySelector(DOMstrings.incomeValue).textContent =
        balance.totalInc;
      document.querySelector(DOMstrings.expenseValue).textContent =
        balance.totalExp;

      if (balance.percent !== 0) {
        document.querySelector(DOMstrings.percentageValue).textContent =
          balance.percent + "%";
      } else {
        document.querySelector(DOMstrings.percentageValue).textContent =
          balance.percent;
      }
    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    addListItem: function (item, type) {
      // Орлого зарлагын элтенмтийг агуулсан html-ийг бэлтгэнэ.
      var html, list;

      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%descr%</div><div class="right clearfix"><div class="item__value">+ %val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%descr%</div><div class="right clearfix"><div class="item__value">- %val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Тэр html дотроо орлого зарлагын утгуудыг Replace ашиглан өөрчлөнө
      html = html.replace("%id%", item.id);
      html = html.replace("%descr%", item.description);
      html = html.replace("%val%", item.value);

      // Бэлтгэсэн html ээ DOM руу хийж өгнө
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();

// **************************************************************************
// Санхүүгийн контролер
// **************************************************************************
var financeController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });

    data.totals[type] = sum;
  };

  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    balance: 0,

    percent: 0,
  };

  return {
    calcBalance: function () {
      calculateTotal("inc");
      calculateTotal("exp");
      // Төсвийг тооцоолох
      data.balance = data.totals.inc - data.totals.exp;

      // Орлого зарлагын хувийг тооцоолох
      if (data.totals.inc > 0)
        data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.percent = 0;
    },

    calculatePercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPercentages = data.items.exp.map(function (el) {
        return el.getPercentage();
      });

      return allPercentages;
    },

    getBalance: function () {
      return {
        balance: data.balance,
        percent: data.percent,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });

      var index = ids.indexOf(id);

      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },

    addItem: function (type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },
    seeData: function () {
      return data;
    },
  };
})();

// **************************************************************************
// Програм холбогч контролер
// **************************************************************************
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    // 1.Оруулах өгөгдлийг олж авна
    var input = uiController.getInput();

    // Талбарууд хоосон үед оруулахгүй
    if (input.description !== "" && input.value !== "") {
      // 2. Олж авсан өгөгдлүүдийг санхүүгийн контролор руу дамжуулж тэнд хадгална.
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );

      // 3. Олж авсан өгөгдлүүдийг вэб дээр тохирох хэсэгт гаргана
      uiController.addListItem(item, input.type);
      // Талбар дээрх утгуудыг цэвэрлэнэ
      uiController.clearFields();
      // Төсвийг шинээр тооцоолж дэлгэцэнд үзүүлнэ
      updateBalance();
    }
  };

  var updateBalance = function () {
    // 4. Төсвийг тооцоолно.
    financeController.calcBalance();

    // 5. Эцсийн үлдэгдэл
    var balance = financeController.getBalance();

    // 6. Төсвийн тооцоог дэлгэцэнд гаргана.
    uiController.seeBalance(balance);

    // 7. Элементүүдийн хувийг тооцоолно
    financeController.calculatePercentages();

    // 8. Элетентүүдийн хувийг хүлээн авна
    var allPercentages = financeController.getPercentages();

    // 9. Эдгээр хувийг дэлгэцэнд гаргана
    uiController.displayPercentages(allPercentages);
  };

  var setupEventListeners = function () {
    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);

          // 1 Санхүүгийн модулиас type, id ашиглан устгана
          financeController.deleteItem(type, itemId);
          // 2. Дэлгэц дээрээс энэ элментийг устгана
          uiController.deleteListItem(id);
          // 3. Үлдэгдэл тооцоог шинэчилж харуулна
          // Төсвийг шинээр тооцоолж дэлгэцэнд үзүүлнэ
          updateBalance();
        }
      });
  };

  return {
    init: function () {
      console.log("Application started...");

      uiController.seeBalance({
        balance: 0,
        percent: 0,
        totalInc: 0,
        totalExp: 0,
      });

      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
