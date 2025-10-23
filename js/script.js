// script.js
(function (global) {
    var dc = {};
    var homeHtmlUrl = "snippets/home-snippet.html";
    var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };

    var switchMenuToActive = function () {
        var classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp("active", "g"), "");
        document.querySelector("#navHomeButton").className = classes;
        classes = document.querySelector("#navMenuButton").className;
        if (classes.indexOf("active") === -1) {
            classes += " active";
            document.querySelector("#navMenuButton").className = classes;
        }
    };

    document.addEventListener("DOMContentLoaded", function (event) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowHomeHTML, // TODO: STEP 1: Substitute [...] with buildAndShowHomeHTML
            true
        );
    });

    function buildAndShowHomeHTML(categories) {
        $ajaxUtils.sendGetRequest(
            homeHtmlUrl,
            function (homeHtml) {
                // TODO: STEP 2: Choose a random category
                var chosenCategoryShortName = chooseRandomCategory(categories).short_name;
                // TODO: STEP 3: Substitute {{randomCategoryShortName}} in homeHtml
                var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", "'" + chosenCategoryShortName + "'");
                // TODO: STEP 4: Insert the produced HTML into #main-content
                insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
            },
            false
        );
    }

    function chooseRandomCategory(categories) {
        var randomArrayIndex = Math.floor(Math.random() * categories.length);
        return categories[randomArrayIndex];
    }

    dc.loadMenuItems = function (categoryShort) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            menuItemsUrl + categoryShort + ".json",
            buildAndShowMenuItemsHTML
        );
    };

    function buildAndShowMenuItemsHTML(categoryMenuItems) {
        $ajaxUtils.sendGetRequest(
            menuItemsTitleHtml,
            function (menuItemsTitleHtml) {
                $ajaxUtils.sendGetRequest(
                    menuItemHtml,
                    function (menuItemHtml) {
                        switchMenuToActive();
                        var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
                        insertHtml("#main-content", menuItemsViewHtml);
                    },
                    false
                );
            },
            false
        );
    };

    function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);
        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";
        for (var i = 0; i < categoryMenuItems.menu_items.length; i++) {
            var html = menuItemHtml;
            var name = "" + categoryMenuItems.menu_items[i].name;
            var short_name = categoryMenuItems.menu_items[i].short_name;
            var price_small = categoryMenuItems.menu_items[i].price_small;
            var price_large = categoryMenuItems.menu_items[i].price_large;
            var small_portion_name = categoryMenuItems.menu_items[i].small_portion_name;
            var large_portion_name = categoryMenuItems.menu_items[i].large_portion_name;
            var description = categoryMenuItems.menu_items[i].description;
            html = insertProperty(html, "short_name", short_name);
            html = insertProperty(html, "name", name);
            if (description) {
                html = insertProperty(html, "description", description);
            } else {
                html = insertProperty(html, "description", "");
            }
            if (price_small) {
                html = insertProperty(html, "price_small", price_small);
            } else {
                html = insertProperty(html, "price_small", "");
            }
            if (price_large) {
                html = insertProperty(html, "price_large", price_large);
            } else {
                html = insertProperty(html, "price_large", "");
            }
            if (small_portion_name) {
                html = insertProperty(html, "small_portion_name", small_portion_name);
            } else {
                html = insertProperty(html, "small_portion_name", "");
            }
            if (large_portion_name) {
                html = insertProperty(html, "large_portion_name", large_portion_name);
            } else {
                html = insertProperty(html, "large_portion_name", "");
            }
            finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;
    }

    global.$dc = dc;
})(window);