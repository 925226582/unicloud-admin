
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "category_id": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "goods_sn": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "货号"
  },
  "name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "名称"
  },
  "keywords": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "关键字"
  },
  "goods_desc": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "详细描述"
  },
  "goods_thumb": {
    "rules": [
      {
        "format": "string"
      },
      {
        "pattern": "^(http://|https://|/|./|@/)\\S"
      }
    ],
    "label": "缩略图地址"
  },
  "goods_banner_imgs": {
    "rules": [
      {
        "format": "array"
      }
    ]
  },
  "remain_count": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ],
    "label": "库存数量"
  },
  "month_sell_count": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ]
  },
  "total_sell_count": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ]
  },
  "comment_count": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ]
  },
  "is_real": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ],
    "label": "是否为实物"
  },
  "is_on_sale": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ],
    "label": "是否上架"
  },
  "is_alone_sale": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ]
  },
  "is_best": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ]
  },
  "is_new": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ],
    "label": "是否新品"
  },
  "is_hot": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ]
  },
  "add_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "defaultValue": {
      "$env": "now"
    }
  },
  "last_modify_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "defaultValue": {
      "$env": "now"
    }
  },
  "seller_note": {
    "rules": [
      {
        "format": "string"
      }
    ]
  }
}

const enumConverter = {}

export { validator, enumConverter }
