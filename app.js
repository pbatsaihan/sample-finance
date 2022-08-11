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
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
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
      // for (var i = 0; i < fieldsArr.length; i++) {
      //   fieldsArr[i].value = "";
      // }
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

    addListItem: function (item, type) {
      // Орлого зарлагын элтенмтийг агуулсан html-ийг бэлтгэнэ.
      var html, list;

      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%descr%</div><div class="right clearfix"><div class="item__value">+ %val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%descr%</div><div class="right clearfix"><div class="item__value">- %val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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
      data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    getBalance: function () {
      return {
        balance: data.balance,
        percent: data.percent,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
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

      // 4. Төсвийг тооцоолно.
      financeController.calcBalance();

      // 5. Эцсийн үлдэгдэл
      var balance = financeController.getBalance();

      // 6. Төсвийн тооцоог дэлгэцэнд гаргана.
      uiController.seeBalance(balance);
      // console.log(balance);
    }
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
