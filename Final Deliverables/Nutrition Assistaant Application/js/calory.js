var stocks = [
    ["Idly", "oz", 0, 1, 19, 15, 1],
    ["puri", "oz", 16.82, 3.39, 2.7, 107, 1],
    ["Ven Pongal", "oz", 23.6, 2.5, 4.4, 134, 1],
    ["Plain Dosa", "oz", 20, 6, 5, 162, 1],
    ["Chapati", "oz", 20, 3, , 4, 120, 1],
    ["Chicken Briyani", "oz", 48, 17, 19, 548, 1],
    ["Mutton Biriyani", "oz", 60, 13, 13, 396, 1],
    ["lemon Rice", "oz", 94.24, 2.28, 13.98, 300, 1],
    ["Sambar Rice", "oz", 30, 6, 6, 210, 1],
    ["Curd Rice", "oz", 41, 5.7, 16.8, 300, 1],
    ["Chicken Breast and White Rice", "oz", 22, 8.5, 30, 171, 1] // Made up values
]

function Stock(data) {
    return {
        name: data[0],
        servingUnit: data[1],
        calories: [data[4], ''],
        protein: [data[3], 'g'],
        fat: [data[4], 'g'],
        carbs: [data[2], 'g'],
        unitsPerServing: data[data.length - 1]
    }
}
stocks = stocks.map(Stock)
var $selects = $('.selectStock')
var $quantity = $('#numberOfStocks')
var $comparisonResult = $('.comparison .result')

$selects.each(function() {
    $(this).append(stocks.map(function(stock, i) {
        return new Option(stock.name, i)
    }))
})

function format(data, multiplier, digits) {
    data = data.slice()
    data[0] = (+(data[0] * multiplier).toFixed(digits)).toLocaleString()
    return data.join(' ')
}

function stockFacts(stock, quantity) {
    return [
        format(stock.calories, quantity, 2) + ' calories<br>' +
        format(stock.protein, quantity, 2) + ' of protein<br>' +
        format(stock.fat, quantity, 3) + ' of fat<br>' +
        format(stock.carbs, quantity, 2) + ' of carbs<br>'
    ]
}

$selects.add($quantity).on('input', updateAmount)

function getStock(select) {
    return stocks[+select.value]
}

function updateAmount() {
    var quantity = +$quantity.val()

    $selects.each(function() {
        var $result = $(this).nextAll('.result').empty()
        var $amount = $(this).prev().find('.servingUnit').empty()
        var stock = getStock(this)
        if (!stock) return
        var amount = quantity * stock.unitsPerServing

        $amount.text(' (' + amount + ' ' + stock.servingUnit + ')')

        $result.html(stockFacts(stock, amount))
    })

    var selected = [].map.call($selects, getStock)
    $comparisonResult.empty()
    if (!selected[0] || !selected[1] || !selected[2]) return
    var diff = {}
    Object.keys(selected[0]).forEach(function(k) {
        if (/^(name|servingUnit|unitsPerServing)$/.test(k)) return
        var first = selected[0][k].slice()
        var second = selected[1][k].slice()
        var third = selected[2][k].slice()
        first[0] *= selected[0].unitsPerServing
        second[0] *= selected[1].unitsPerServing
        third[0] *= selected[2].unitsPerServing
        diff[k] = [Math.abs(first[0] - second[0]), first[1], first[0] > second[0] ? 'more' : 'less']
    })
    $comparisonResult.html(stockFacts(diff, quantity))
}