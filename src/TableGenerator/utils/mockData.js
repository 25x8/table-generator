export const conf = {
    characteristics: [
        {
            id: "weight",
            label: "Вес",
            dict: false,
            measure: [ {id: 0, value: "см"}]
        },{
            id: "length",
            label: "Длина",
            dict: false,
            measure: [ {id: 0, value: "см"}, {id: 1, value: 'm'}]
        }
    ],
    inputs: [
        {
            id: "inner_diameter",
            label: "Внутренний диаметр",
            dict: true,
            options: [{id: 25, value: 25}, {id: 50, value: 50}, {id: 100, value: 100}]
        },
        {
            id: "outer_diameter",
            label: "Внешний диаметр",
            dict: false,
        }
    ],
    grades: [
        {
            id: "premium",
            label: "Премиум"
        },
        {
            id: "secondary",
            label: "Второй класс"
        },
        {
            id: "reject",
            label: "Отбраковка"
        }
    ]
}


export const data = [
    {
        id: "data-1",
        characteristics: [
            {
                id: "weight",
                min: null,
                max: null,
                eq: null,
                measure: 0
            },{
                id: "length",
                min: null,
                max: null,
                eq: null,
                measure: 1
            }
        ],
        rules: [ //!отфильтровано по классам
            {
                id: "inner_diameter",
                min: 100,
                max: null,
                eq: null,
                grade: "premium",
            },
            {
                id: "outer_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "premium"
            },
            {
                id: "inner_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "secondary"
            },
            {
                id: "outer_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "secondary"
            },
            {
                id: "inner_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "reject"
            },
            {
                id: "outer_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "reject"
            },
        ]
    }
]
