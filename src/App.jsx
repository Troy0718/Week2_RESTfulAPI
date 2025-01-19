import { useState } from 'react';
import "./assets/style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';


// Table元件：顯示產品列表
const Table = ({ products, onClick }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>產品名稱</th>
          <th>原價</th>
          <th>售價</th>
          <th>是否啟用</th>
          <th>查看細節</th>
        </tr>
      </thead>
      <tbody>
        {
          products && products.length > 0 ? (
            products.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.origin_price}</td>
                <td>{item.price}</td>
                <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => onClick(item)}>
                    查看細節
                  </button>
                </td>
              </tr>
        ))
      ):
      (<tr>
        <td colSpan="5">尚無產品資料</td>
      </tr>)}
      </tbody>
    </table>
  );
};
// ProductDetail元件：顯示單個產品的詳細信息
const ProductDetail = ({ tempProduct }) => {
  // 如果tempProduct為null，顯示提示訊息
  if (!tempProduct) {
    return <p className="text-secondary">請選擇一個商品查看</p>;
  }
  // 解構tempProduct來獲取商品的各個屬性
  const {
    imageUrl,
    title,
    category,
    price,
    description,
    content,
    origin_price,
    imagesUrl,
  } = tempProduct;

  return (
    <div className="card mb-3">
      <img src={imageUrl} className="card-img-top primary-image" alt="主圖" />
      <div className="card-body">
        <h5 className="card-title">
          {title}
          <span className="badge bg-primary ms-2">{category}</span>
        </h5>
        <p className="card-text">商品描述：{description}</p>
        <p className="card-text">商品內容：{content}</p>
        <div className="d-flex">
          <p className="card-text text-secondary">
            <del>{origin_price}</del>
          </p>
          元 / {price} 元
        </div>

        <h5 className="mt-3">更多圖片：</h5>
        <div className="d-flex flex-wrap">
          {imagesUrl.map((url, index) => (
            <img key={index} src={url} className="images" />
          ))}
        </div>
      </div>
    </div>
  );
};

//loginForm元件
const loginForm元件 = ({})=>{

}


function App() {
  const url ='https://ec-course-api.hexschool.io/v2';
  const path='chenjiang';

  const [formData, setFormData] = useState({
    username:'',
    password:''
  })
  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);




    const login = async (e)=>{
      e.preventDefault();
      try{
        const res= await axios.post(`${url}/admin/signin`,formData
      );
        console.log(res);
        //儲存token
        const {token, expired}=res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
        axios.defaults.headers.common.Authorization = token;
        getProducts();
        setisAuth(true);
      }catch(error){
        console.log(error);
        alert("登入失敗: " + error.res.data.message);
      }
     }
    const checkLogin= async ()=>{
      try {
        const token =document.cookie.replace(
          /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",
        );
        console.log(token);
        axios.defaults.headers.common['Authorization']=token;
        //1.會全部套用預設值
        //2.需要再執行其他需要驗證程式碼前加入
        //3.當呼叫其他API時需要移除
        const res= await axios.post(`${url}/api/user/check`,{},{
          headers:{
            authorization: token
          }
        });
        console.log(res);
      } catch (error) {
        console.error(error);
      }
      }
    const getProducts =async function(){
        try{
          const response= await axios.get(`${url}/api/${path}/admin/products`);
            console.log(response.data);
            setProducts(response.data.products);
        }catch(error){
          console.error(err.response.data.message);
        }
      }



    function handleInputChange(e){
        const {name,value}=e.target;
        setFormData({// 完整覆蓋
          ...formData,//展開，把原始物件展開帶入
          [name]: value
        })
      }

  return (
    <>
      {isAuth?(
        <div className="container">
        <div className="row mt-5">
          <div className="col-md-6">
            <button className='btn btn-danger mb-5' type="button" id="check" onClick={checkLogin} >確認是否登入</button>
            <h2>產品列表</h2>
            {/* 傳遞產品列表和查看細節的回調函數onClick */}
            <Table  products={products} onClick={(item) => setTempProduct(item)} />
          </div>
          <div className="col-md-6">
            <h2>單一產品細節</h2>
            {/* 傳遞tempProduct給ProductDetail組件 */}
            <ProductDetail tempProduct={tempProduct} />
          </div>
        </div>
      </div>
      ):(
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={login}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    name="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                   <label htmlFor="username">Email address: </label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password: </label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  )
}

export default App
