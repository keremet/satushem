import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import qs from 'qs';
import {environment} from '../environments/environment';

const API_URL = environment.apiUrl;
const ORV_API_URL = 'http://orv.org.ru/satushem/api';

@Injectable({providedIn: 'root'})
export class RestApiService {

  constructor(private http: HttpClient) {
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders().set('Authorization', token)
      : null;
  }

  get(link: string) {
    return this
      .http
      .get(link, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  post(link: string, body: any) {
    return this
      .http
      .post(link, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  put(link: string, body: any) {
    return this
      .http
      .put(link, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  loginUser(body: any) {
    return this
      .http
      .post(`${ORV_API_URL}/login.php`, body)
      .toPromise();
  }

  signupUser(body: any) {
    return this
      .http
      .post(`${API_URL}/api/accounts/signup`, body)
      .toPromise();
  }

  subscribe(body: any) {
    return this
      .http
      .post(`${API_URL}/api/subscription/subscribe`, body)
      .toPromise();
  }

  resetPassword(body: any) {
    return this
      .http
      .post(`${API_URL}/api/accounts/reset`, body)
      .toPromise();
  }

  getUserProfile() {
    return this
      .http
      .get(`${ORV_API_URL}/profile.php`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateUserProfile(body) {
    return this
      .http
      .post(`${API_URL}/api/accounts/profile`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getUserStores() {
    return this
      .http
      .get(`${API_URL}/api/accounts/stores`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  createStore(body: any) {
    return this
      .http
      .post(`${API_URL}/api/stores/add`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  sendError(body: any) {
    return this
      .http
      .post(`${API_URL}/api/errors/add`, body)
      .toPromise();
  }

  sendFeature(body: any) {
    return this
      .http
      .post(`${API_URL}/api/features/add`, body)
      .toPromise();
  }

  deleteStore(link: string) {
    return this
      .http
      .request('DELETE', `${API_URL}/api/stores/delete`, {
        headers: this.getHeaders(),
        body: {
          link: link
        }
      })
      .toPromise();
  }

  updatePassword(body: any) {
    return this
      .http
      .put(`${API_URL}/api/accounts/profile/security`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  uploadImage(apiUrl: string, body: any) {
    const headers = this.getHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    console.log(body);
    return this
      .http
      .post(`${apiUrl}/new.php`, body)
      .toPromise();
  }

  updateAddress(body: any) {
    return this
      .http
      .put(`${API_URL}/api/accounts/profile/address`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateAvatar(body: any) {
    return this
      .http
      .put(`${API_URL}/api/accounts/profile/avatar`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateCart(body: any) {
    return this
      .http
      .put(`${API_URL}/api/accounts/cart`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getStoreByLink(storeLink: string) {
    return this
      .http
      .get(`${API_URL}/api/stores/${storeLink}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getGoodsByStoreId(storeId: string) {
    return this
      .http
      .get(`${API_URL}/api/stores/goods/${storeId}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getStoreById(store_id: string) {
    return this
      .http
      .get(`${API_URL}/api/stores/id/${store_id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getAllStores() {
    return this
      .http
      .get(`${API_URL}/api/stores/get/all`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }


  updateStoreInfo(link: string, field: string, body: any) {
    return this
      .http
      .put(`${API_URL}/api/stores/update/${field}`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getUserById(id: string) {
    return this
      .http
      .get(`${API_URL}/api/users/find/id/${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getUserByLogin(login: string) {
    return this
      .http
      .get(`${API_URL}/api/users/find/login/${login}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  createGood(body: any) {
    return this
      .http
      .post(`${API_URL}/api/goods/add`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  deleteGood(id: number) {
    return this
      .http
      .request('DELETE', `${API_URL}/api/goods/delete`, {
        headers: this.getHeaders(),
        body: {
          good_id: id
        }
      })
      .toPromise();
  }

  getGoodById(id: string) {
    return this
      .http
      .get(`${API_URL}/api/goods/${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateGoodInfo(good_id: string, field: string, body: any) {
    return this
      .http
      .put(`${API_URL}/api/goods/update/${field}`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getCommentsForGood(good_id: string) {
    return this
      .http
      .get(`${API_URL}/api/comments/good/${good_id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addComment(body: any) {
    return this
      .http
      .post(`${API_URL}/api/comments/add`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addStoreCategory(body: any) {
    return this
      .http
      .post(`${API_URL}/api/category/add/store`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getAllStoreCategories() {
    return this
      .http
      .get(`${API_URL}/api/category/get/store`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getStoreCategoryById(id: string) {
    return this
      .http
      .get(`${API_URL}/api/category/get/store/id/:id${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addGoodCategory(body: any) {
    return this
      .http
      .post(`${API_URL}/api/category/add/good`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getAllGoodCategories() {
    return this
      .http
      .get(`${ORV_API_URL}/get_cat_list.php`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getGoodCategoryTree() {
    return this
      .http
      .get(`${ORV_API_URL}/get_cat_tree.php`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getGoodCategoryById(id: string) {
    return this
      .http
      .get(`${API_URL}/api/category/get/good/id/${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateOrders(body: any) {
    return this
      .http
      .put(`${API_URL}/api/accounts/orders`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addOrder(body: any) {
    return this
      .http
      .post(`${API_URL}/api/orders/add`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addOrders(body: any) {
    return this
      .http
      .post(`${API_URL}/api/orders/add/array`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getOrders() {
    return this
      .http
      .get(`${API_URL}/api/accounts/orders`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getStoreOrders(id) {
    return this
      .http
      .get(`${API_URL}/api/stores/orders/${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateOrderStatusDelivered(id: string) {
    const body = {
      id: id
    };
    return this
      .http
      .put(`${API_URL}/api/orders/status/delivered`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateOrderStatusObtained(id: string) {
    const body = {
      id: id
    };
    return this
      .http
      .put(`${API_URL}/api/orders/status/obtained`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getAllGoods(page: number, size: number) {
    return this
      .http
      .get(`${API_URL}/api/goods/list/${page}/${size}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getGoodInCart(id: string) {
    return this
      .http
      .get(`${API_URL}/api/goods/cart/${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  searchGoodsByAllFields(page: number, size: number, query: any) {
    let params = new HttpParams();

    for (const param in query) {
      if (query.hasOwnProperty(param)) {
        params = params.append(param, query[param]);
      }
    }

    return this
      .http
      .get(`${API_URL}/api/search/all/${page}/${size}`, {
        params: params,
        headers: this.getHeaders()
      })
      .toPromise();
  }

  searchGoodsByAnyField(page: number, size: number, query: string, filter: string) {
    const params = new HttpParams()
      .append('query', query)
      .append('filter', filter);

    return this
      .http
      .get(`${API_URL}/api/search/any/${page}/${size}`, {
        params: params,
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addJointPurchase(body: any) {
    return this
      .http
      .post(`${API_URL}/api/jointpurchases/add`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addGoodJoinPurchase(body: any) {
    return this
      .http
      .post(`${API_URL}/api/jointpurchases/add/good`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getJointPurchaseById(id: string) {
    return this
      .http
      .get(`${API_URL}/api/jointpurchases/get/${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  searchJointPurchases(page: number, size: number, query: string, filter: string) {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('size', size.toString())
      .append('query', query)
      .append('filter', filter);

    return this
      .http
      .get(`${ORV_API_URL}/jp_search.php`, {
        params: params,
        headers: this.getHeaders()
      })
      .toPromise();
  }

  searchGoodJointPurchases(filter: string) {
    const params = new HttpParams()
      .append('filter', filter);

    return this
      .http
      .get(`${API_URL}/api/search/goodpurchases`, {
        params: params,
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updatePurchaseInfo(id: string, field: string, value: any) {
    const body = {
      id: id,
      value: value
    };

    return this
      .http
      .put(`${API_URL}/api/jointpurchases/update/${field}`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  joinToPurchase(id: string, volume: number) {
    const body = {
      id: id,
      volume: volume
    };

    return this
      .http
      .put(`${API_URL}/api/jointpurchases/participants`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  joinFakeUserToPurchase(id: string, login: string, volume: number) {
    const body = {
      id: id,
      volume: volume,
      login: login
    };

    return this
      .http
      .put(`${API_URL}/api/jointpurchases/participants/fake`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  detachFromPurchase(id: string) {
    return this
      .http
      .request('DELETE', `${API_URL}/api/jointpurchases/participants`, {
        headers: this.getHeaders(),
        body: {
          id: id
        }
      })
      .toPromise();
  }

  detachFakeUserFromPurchase(id: string, login: string) {
    return this
      .http
      .request('DELETE', `${API_URL}/api/jointpurchases/participants/fake`, {
        headers: this.getHeaders(),
        body: {
          id: id,
          login: login
        }
      })
      .toPromise();
  }

  updatePaymentPurchase(id: string, userId: string, date: Date) {
    const body = {
      id: id,
      user_id: userId,
      date: date
    };

    return this
      .http
      .put(`${API_URL}/api/jointpurchases/payments/update`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateFakeUserPaymentPurchase(id: string, login: string, date: Date) {
    const body = {
      id: id,
      login: login,
      date: date
    };

    return this
      .http
      .put(`${API_URL}/api/jointpurchases/payments/update/fake`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateDeliveryPurchase(id: string, userId: string, state: boolean) {
    const body = {
      id: id,
      user_id: userId,
      state: state
    };

    return this
      .http
      .put(`${API_URL}/api/jointpurchases/deliveries/update`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateOrderSentPurchase(id: string, userId: string, date: Date) {
    const body = {
      id: id,
      user_id: userId,
      date: date
    };

    return this
      .http
      .put(`${API_URL}/api/jointpurchases/sent/update`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateFakeUserOrderSentPurchase(id: string, login: string, date: Date) {
    const body = {
      id: id,
      login: login,
      date: date
    };

    return this
      .http
      .put(`${API_URL}/api/jointpurchases/sent/update/fake`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getUserPurchases(userId: string) {
    return this
      .http
      .get(`${API_URL}/api/jointpurchases/owner`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getPurchaseOrders() {
    return this
      .http
      .get(`${API_URL}/api/jointpurchases/orders`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addUserToPurchaseBlackList(id: string, userId: string) {
    const body = {
      id: id,
      user_id: userId
    };

    return this
      .http
      .put(`${API_URL}/api/jointpurchases/black_list`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  removeUserFromPurchaseBlackList(id: string, userId: string) {
    const body = {
      id: id,
      user_id: userId
    };

    return this
      .http
      .request('DELETE', `${API_URL}/api/jointpurchases/black_list`, {
        headers: this.getHeaders(),
        body: body
      })
      .toPromise();
  }

  addCommentToPurchase(id: string, text: string, parentId: string = null) {
    const body = {
      id: id,
      text: text,
      parent_id: parentId
    };

    return this
      .http
      .post(`${API_URL}/api/jointpurchases/comment/add`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getPurchaseCommentTree(id: string) {
    return this
      .http
      .get(`${API_URL}/api/jointpurchases/comment/tree/${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getAllMeasurementUnits() {
    return this
      .http
      .get(`${API_URL}/api/measurementunits/get`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addMeasurementUnit(body: any) {
    return this
      .http
      .post(`${API_URL}/api/measurementunits/add`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getAllChats() {
    return this
      .http
      .get(`${API_URL}/api/chats/all`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getChatHistory(chat_id: string) {
    return this
      .http
      .get(`${API_URL}/api/chats/history/${chat_id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }
}
