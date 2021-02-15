import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import qs from 'qs';
import {environment} from '../environments/environment';

const API_URL = environment.apiUrl;

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

  loginUser(body: any) {
    return this
      .http
      .post(`${API_URL}/login.php`, body)
      .toPromise();
  }

  signupUser(login, password) {
    return this
      .http
      .get(`${API_URL}/add_user.php?login=${login}&password=${password}`)
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
      .get(`${API_URL}/profile.php`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateUserProfile(visible_name, contacts) {
    return this
      .http
      .get(`${API_URL}/update_profile.php?visible_name=${visible_name}&contacts=${contacts}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updatePassword(body: any) {
    return this
      .http
      .post(`${API_URL}/update_passwd.php`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  uploadImage(body: any) {
    const headers = this.getHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    console.log(body);
    return this
      .http
      .post(`${API_URL}/new_img.php`, body)
      .toPromise();
  }

  updateAddress(address) {
    return this
      .http
      .get(`${API_URL}/update_address.php?newaddress=${address}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateAvatar(body: any) {
    return this
      .http
      .post(`${API_URL}/api/accounts/profile/avatar`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getUserById(id: string) {
    return this
      .http
      .get(`${API_URL}/get_member.php?id=${id}`, {
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

  getAllGoodCategories() {
    return this
      .http
      .get(`${API_URL}/get_cat_list.php`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getGoodCategoryTree() {
    return this
      .http
      .get(`${API_URL}/get_cat_tree.php`, {
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
      .post(`${API_URL}/add_jp.php`, body, {
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
      .get(`${API_URL}/get_jp.php?id=${id}`, {
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
      .get(`${API_URL}/jp_search.php`, {
        params: params,
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updatePurchaseInfo(id: string, field: string, value: any) {
    return this
      .http
      .get(`${API_URL}/update_jp.php?id=${id}&prop=${field}&value=${value}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  joinToPurchase(id: string, volume: number) {
    const body = {
      purchase_id: id,
      volume: volume
    };

    return this
      .http
      .post(`${API_URL}/add_my_request.php`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addRequest(id: string, memberId: number, volume: number) {
    const body = {
      purchase_id: id,
      volume: volume,
      member_id: memberId
    };

    return this
      .http
      .post(`${API_URL}/add_request.php`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  deleteRequest(id: number) {
    const body = {
      id: id
    };

    return this
      .http
      .post(`${API_URL}/del_request.php`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  detachFromPurchase(id: string) {
    const body = {
      purchase_id: id
    };
  
    return this
      .http
      .post(`${API_URL}/del_my_request.php`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

 /* updateDeliveryPurchase(id: string, userId: string, state: boolean) {
    const body = {
      id: id,
      user_id: userId,
      state: state
    };

    return this
      .http
      .post(`${API_URL}/api/jointpurchases/deliveries/update`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  } */

  getUserPurchases() {
    return this
      .http
      .get(`${API_URL}/get_my_jps.php`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getPurchaseOrders() {
    return this
      .http
      .get(`${API_URL}/get_orders.php`, {
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
      .post(`${API_URL}/api/jointpurchases/black_list`, body, {
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
      .request('POST', `${API_URL}/api/jointpurchases/black_list`, {
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
      .get(`${API_URL}/get_jp_comment_tree.php?purchase_id=${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getAllMeasurementUnits() {
    return this
      .http
      .get(`${API_URL}/get_unit.php`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addMeasurementUnit(body: any) {
    return this
      .http
      .post(`${API_URL}/add_unit.php`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getAllMembers() {
    return this
      .http
      .get(`${API_URL}/get_all_members.php`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addMember(login, passwd, visible_name) {
    return this
      .http
      .get(`${API_URL}/add_member.php?login=${login}&passwd=${passwd}&visible_name=${visible_name}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateRequestVolume(request_id, new_volume) {
    return this
      .http
      .get(`${API_URL}/update_req_volume.php?request_id=${request_id}&new_volume=${new_volume}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addIssue(request_id, volume, date) {
    return this
      .http
      .get(`${API_URL}/add_issue.php?request_id=${request_id}&volume=${volume}&date=${date}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  addPayment(request_id, volume, date) {
    return this
      .http
      .get(`${API_URL}/add_payment.php?request_id=${request_id}&volume=${volume}&date=${date}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  } 
}
