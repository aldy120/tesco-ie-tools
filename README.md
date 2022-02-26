# Get the current list

# cart
  -d @cart.json \
  --data-raw '{"items":[{"id":"268290106","newValue":30,"newUnitChoice":"pcs","substitutionOption":"FindSuitableAlternative"},{"id":"298040830","newValue":4,"newUnitChoice":"pcs","substitutionOption":"FindSuitableAlternative"}],"returnUrl":"/groceries/en-IE/trolley"}' \

# Steps
1. 傳一個 PUT body=[]
2. 將輸出轉換成購物單，即為目前的單
3. 與第二個人的單合併
4. PUT 第二次，輸入是合併完成的

# 
```json
'{"items":[],"returnUrl":"/groceries/en-IE/trolley"}'
```
