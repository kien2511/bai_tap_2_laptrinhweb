# bai_tap_2_laptrinhweb
Bài tập 02: Lập trình web.
==============================
NGÀY GIAO: 19/10/2025
==============================
DEADLINE: 26/10/2025
==============================
1. Sử dụng github để ghi lại quá trình làm, tạo repo mới, để truy cập public, edit file `readme.md`:
   chụp ảnh màn hình (CTRL+Prtsc) lúc đang làm, paste vào file `readme.md`, thêm mô tả cho ảnh.
2. NỘI DUNG BÀI TẬP:
2.1. Cài đặt Apache web server:
- Vô hiệu hoá IIS: nếu iis đang chạy thì mở cmd quyền admin để chạy lệnh: iisreset /stop
- Download apache server, giải nén ra ổ D, cấu hình các file:
  + D:\Apache24\conf\httpd.conf
  + D:Apache24\conf\extra\httpd-vhosts.conf
  để tạo website với domain: fullname.com
  code web sẽ đặt tại thư mục: `D:\Apache24\fullname` (fullname ko dấu, liền nhau)
- sử dụng file `c:\WINDOWS\SYSTEM32\Drivers\etc\hosts` để fake ip 127.0.0.1 cho domain này
  ví dụ sv tên là: `Đỗ Duy Cốp` thì tạo website với domain là fullname ko dấu, liền nhau: `doduycop.com`
- thao tác dòng lệnh trên file `D:\Apache24\bin\httpd.exe` với các tham số `-k install` và `-k start` để cài đặt và khởi động web server apache.
2.2. Cài đặt nodejs và nodered => Dùng làm backend:
- Cài đặt nodejs:
  + download file `https://nodejs.org/dist/v20.19.5/node-v20.19.5-x64.msi`  (đây ko phải bản mới nhất, nhưng ổn định)
  + cài đặt vào thư mục `D:\nodejs`
- Cài đặt nodered:
  + chạy cmd, vào thư mục `D:\nodejs`, chạy lệnh `npm install -g --unsafe-perm node-red --prefix "D:\nodejs\nodered"`
  + download file: https://nssm.cc/release/nssm-2.24.zip
    giải nén được file nssm.exe
    copy nssm.exe vào thư mục `D:\nodejs\nodered\`
  + tạo file "D:\nodejs\nodered\run-nodered.cmd" với nội dung (5 dòng sau):
@echo off
REM fix path
set PATH=D:\nodejs;%PATH%
REM Run Node-RED
node "D:\nodejs\nodered\node_modules\node-red\red.js" -u "D:\nodejs\nodered\work" %*
  + mở cmd, chuyển đến thư mục: `D:\nodejs\nodered`
  + cài đặt service `a1-nodered` bằng lệnh: nssm.exe install a1-nodered "D:\nodejs\nodered\run-nodered.cmd"
  + chạy service `a1-nodered` bằng lệnh: `nssm start a1-nodered`
2.3. Tạo csdl tuỳ ý trên mssql (sql server 2022), nhớ các thông số kết nối: ip, port, username, password, db_name, table_name
2.4. Cài đặt thư viện trên nodered:
- truy cập giao diện nodered bằng url: http://localhost:1880
- cài đặt các thư viện: node-red-contrib-mssql-plus, node-red-node-mysql, node-red-contrib-telegrambot, node-red-contrib-moment, node-red-contrib-influxdb, node-red-contrib-duckdns, node-red-contrib-cron-plus
- Sửa file `D:\nodejs\nodered\work\settings.js` : 
  tìm đến chỗ adminAuth, bỏ comment # ở đầu dòng (8 dòng), thay chuỗi mã hoá mật khẩu bằng chuỗi mới
    adminAuth: {
        type: "credentials",
        users: [{
            username: "admin",
            password: "chuỗi_mã_hoá_mật_khẩu",
            permissions: "*"
        }]
    },   
   với mã hoá mật khẩu có thể thiết lập bằng tool: https://tms.tnut.edu.vn/pw.php
- chạy lại nodered bằng cách: mở cmd, vào thư mục `D:\nodejs\nodered` và chạy lệnh `nssm restart a1-nodered`
  khi đó nodered sẽ yêu cầu nhập mật khẩu mới vào được giao diện cho admin tại: http://localhost:1880
2.5. tạo api back-end bằng nodered:
- tại flow1 trên nodered, sử dụng node `http in` và `http response` để tạo api
- thêm node `MSSQL` để truy vấn tới cơ sở dữ liệu
- logic flow sẽ gồm 4 node theo thứ tự sau (thứ tự nối dây): 
  1. http in  : dùng GET cho đơn giản, URL đặt tuỳ ý, ví dụ: /timkiem
  2. function : để tiền xử lý dữ liệu gửi đến
  3. MSSQL: để truy vấn dữ liệu tới CSDL, nhận tham số từ node tiền xử lý
  4. http response: để phản hồi dữ liệu về client: Status Code=200, Header add : Content-Type = application/json
  có thể thêm node `debug` để quan sát giá trị trung gian.
- test api thông qua trình duyệt, ví dụ: http://localhost:1880/timkiem?q=thị
2.6. Tạo giao diện front-end:
- html form gồm các file : index.html, fullname.js, fullname.css
  cả 3 file này đặt trong thư mục: `D:\Apache24\fullname`
  nhớ thay fullname là tên của bạn, viết liền, ko dấu, chữ thường, vd tên là Đỗ Duy Cốp thì fullname là `doduycop`
  khi đó 3 file sẽ là: index.html, doduycop.js và doduycop.css
- index.html và fullname.css: trang trí tuỳ ý, có dấu ấn cá nhân, có form nhập được thông tin.
- fullname.js: lấy dữ liệu trên form, gửi đến api nodered đã làm ở bước 2.5, nhận về json, dùng json trả về để tạo giao diện phù hợp với kết quả truy vấn của bạn.
2.7. Nhận xét bài làm của mình:
- đã hiểu quá trình cài đặt các phần mềm và các thư viện như nào?
- đã hiểu cách sử dụng nodered để tạo api back-end như nào?
- đã hiểu cách frond-end tương tác với back-end ra sao?
==============================
TIÊU CHÍ CHẤM ĐIỂM:
1. y/c bắt buộc về thời gian: ko quá Deadline, quá: 0 điểm (ko có ngoại lệ)
2. cài đặt được apache và nodejs và nodered: 1đ
3. cài đặt được các thư viện của nodered: 1đ
4. nhập dữ liệu demo vào sql-server: 1đ
5. tạo được back-end api trên nodered, test qua url thành công: 1đ
6. tạo được front-end html css js, gọi được api, hiển thị kq: 1đ
7. trình bày độ hiểu về toàn bộ quá trình (mục 2.7): 5đ
==============================
GHI CHÚ:
1. yêu cầu trên cài đặt trên ổ D, nếu máy ko có ổ D có thể linh hoạt chuyển sang ổ khác, path khác.
2. có thể thực hiện trực tiếp trên máy tính windows, hoặc máy ảo
3. vì csdl là tuỳ ý: sv cần mô tả rõ db chứa dữ liệu gì, nhập nhiều dữ liệu test có nghĩa, json trả về sẽ có dạng như nào cũng cần mô tả rõ.
4. có thể xây dựng nhiều API cùng cơ chế, khác tính năng: như tìm kiếm, thêm, sửa, xoá dữ liệu trong DB.
5. bài làm phải có dấu ấn cá nhân, nghiêm cấm mọi hình thức sao chép, gian lận (sẽ cấm thi nếu bị phát hiện gian lận).
6. bài tập thực làm sẽ tốn nhiều thời gian, sv cần chứng minh quá trình làm: save file `readme.md` mỗi khoảng 15-30 phút làm : lịch sử sửa đổi sẽ thấy quá trình làm này!
7. nhắc nhẹ: github ko fake datetime được.
8. sv được sử dụng AI để tham khảo.
==============================
DEADLINE: 26/10/2025
==============================
# bài làm 
Cài đặt Apache web server:
vào cốc cốc hoặc chorme gõ apache
<img width="1077" height="696" alt="image" src="https://github.com/user-attachments/assets/d80b7692-30b1-41fc-bda4-6ef24ad9f08b" />
tick chọ download
<img width="231" height="207" alt="image" src="https://github.com/user-attachments/assets/2aa94768-5e9a-4ec4-8a45-3ffb576af500" />
chọn apache launge
<img width="389" height="128" alt="image" src="https://github.com/user-attachments/assets/9d0c73e7-636c-4154-b6c5-c67e5b8d6ea8" />
chọn bản cài đặt phù hợp với window
<img width="611" height="166" alt="image" src="https://github.com/user-attachments/assets/0624eaa0-983f-45de-a48a-db05bc2dcab5" />
vào cmd chạy với quyền admin
<img width="1104" height="631" alt="image" src="https://github.com/user-attachments/assets/a6135126-7e1e-4b3f-9479-44939c152acc" />
nhập đường dẫn 
<img width="551" height="164" alt="image" src="https://github.com/user-attachments/assets/da651faf-28e6-4af6-89cb-4ca705e546ee" />
cài apache
<img width="1066" height="279" alt="image" src="https://github.com/user-attachments/assets/01f94612-baf3-4e8b-8cea-e64497ed9b0f" />
khởi động apache
<img width="1096" height="144" alt="image" src="https://github.com/user-attachments/assets/c6163d51-d8ef-4a22-9fef-d763d3804a6a" />
lên trình duyệt gõ http://localhost
<img width="1735" height="378" alt="image" src="https://github.com/user-attachments/assets/c19192de-580a-45ad-98fa-91c1d695aa0a" />
apache đã khởi động 
đổi tên localhost thàng nguyentrungkien.com
chạy nodepad với quyền quản trị viên 
file host
thêm 127.0.0.1 nguyenrungkien.com
<img width="840" height="565" alt="image" src="https://github.com/user-attachments/assets/d389ab6b-0fad-401c-a660-af6625a41caa" />

file httpd-vhost.conf
<img width="608" height="311" alt="image" src="https://github.com/user-attachments/assets/5d95057d-7c56-4158-89b4-c2d69c533dc7" />

file httpd.conf
đổi severname với admin thành nguyentrungkien.com
<img width="1084" height="403" alt="image" src="https://github.com/user-attachments/assets/39147b14-118a-4067-aeb9-8f53e61e1efb" />

chạy cmd với quyền quản trị viên 
restart lại apache

lên trình duyệt gõ http://nguyentrungkien.com 
<img width="1862" height="353" alt="image" src="https://github.com/user-attachments/assets/e479d34e-eec6-4987-bb74-2b2b3a2d824c" />

2.2. Cài đặt nodejs và nodered => Dùng làm backend

lên trình duyệt tìm node.js
download bản mới nhất 
<img width="1879" height="891" alt="image" src="https://github.com/user-attachments/assets/fe11956d-8e82-4a0d-8bbf-906fe38c6f29" />

kiểm tra node js cài thành công không 
<img width="1078" height="479" alt="image" src="https://github.com/user-attachments/assets/51311c20-03f6-4146-94f1-a3c8290cf912" />
cài node red
<img width="735" height="289" alt="image" src="https://github.com/user-attachments/assets/84a159b7-9d67-44fa-88cb-3acd6bc00728" />
khởi động node red
<img width="832" height="398" alt="image" src="https://github.com/user-attachments/assets/a12ed21c-5cf6-43f3-9f55-bff1dd01b1c0" />
lên gg tìm http://http://127.0.0.1:1880/
<img width="784" height="437" alt="image" src="https://github.com/user-attachments/assets/84a4b8c2-5ecf-4f87-91ac-9d97d890a3ea" />
cấu hình node red
<img width="1235" height="655" alt="image" src="https://github.com/user-attachments/assets/156acf34-65e5-4d27-bcd7-9e665b1c5adf" />

cấu hình mssql
<img width="645" height="835" alt="image" src="https://github.com/user-attachments/assets/2ecce93b-e195-43d0-83c8-3e71df481cb0" />

khi ấn deloy

tìm kết quả với chữ nguyễn
<img width="509" height="867" alt="image" src="https://github.com/user-attachments/assets/9419faae-6157-46da-b643-ad0495f36d61" />

ở database em có 1 project như này 
<img width="779" height="223" alt="image" src="https://github.com/user-attachments/assets/d48323c0-a34a-42c3-9ba0-f3b6a71b8a90" />
cấu hình của em như trên để truy vấn dữ liêu trong project

tạo html css js để gọi json tả về kết quả cần tìm 
<img width="1235" height="864" alt="image" src="https://github.com/user-attachments/assets/b5a36d93-f9f6-4818-b04c-8adf92f1e5ac" />


2.7. Nhận xét bài làm của mình:
- đã hiểu quá trình cài đặt các phần mềm và các thư viện như nào?
- đã hiểu cách sử dụng nodered để tạo api back-end như nào?
- đã hiểu cách frond-end tương tác với back-end ra sao?

Trong quá trình học và thực hành, em đã hiểu rõ quy trình cài đặt các phần mềm và các thư viện cần thiết cho hệ thống. Việc cài đặt bao gồm chuẩn bị môi trường lập trình, thiết lập các công cụ nền tảng như Node.js, Apache, hoặc các cơ sở dữ liệu, đồng thời cài đặt các thư viện hỗ trợ giúp hệ thống hoạt động ổn định và hiệu quả.

Em cũng đã nắm được cách sử dụng Node-RED để xây dựng các API back-end. Cụ thể, thông qua giao diện kéo thả trực quan của Node-RED, em có thể tạo các luồng xử lý dữ liệu, định nghĩa các endpoint API, kết nối với cơ sở dữ liệu và triển khai các chức năng trả về dữ liệu cho người dùng mà không cần viết quá nhiều mã nguồn phức tạp.

Bên cạnh đó, em đã hiểu cách thức mà phần front-end tương tác với back-end. Front-end sẽ gửi các yêu cầu (request) đến API do Node-RED tạo ra, sau đó back-end tiếp nhận, xử lý và phản hồi dữ liệu (response) trở lại để front-end hiển thị cho người dùng. Quá trình này giúp em hiểu sâu hơn về cơ chế hoạt động của ứng dụng web, cũng như mối liên kết giữa giao diện người dùng và hệ thống xử lý dữ liệu phía máy chủ.






