const { net, ipcRenderer } = require('electron');
const Swal = require('sweetalert2');

const reader_key = 'k130290184##191284290184220220110211201313091983$$';
const url_check_app = 'https://kubuku.id/api/wl/checkAppVersion';
const url_login = 'https://kubuku.id/api/wl/executeLogin';
const url_credentials = 'https://kubuku.id/api/wl/checkLoginCredentials';
const url_homepage = 'https://kubuku.id/api/wl/initialData';
const url_section_detail = 'https://kubuku.id/api/wl/listHomepageDetail';
const url_category_detail = 'https://kubuku.id/api/wl/listContentCategory';
const url_sub_category_detail = 'https://kubuku.id/api/wl/listContentSubCategory';
const url_news = 'https://kubuku.id/api/wl/news';
const url_news_detail = 'https://kubuku.id/api/wl/newsDetail';
const url_searching = 'https://kubuku.id/api/wl/searching';
const url_searching_kalimat = 'https://kubuku.id/api/wl/searchingKalimat';
const url_detail_buku = 'https://kubuku.id/api/wl/detailKonten';
const url_direct_login = 'https://kubuku.id/api/wl/directLogin';
const url_direct_registration = 'https://kubuku.id/api/wl/directRegistration';
const url_konten_non_koleksi = 'https://kubuku.id/api/wl/kontenNonKoleksi';
const url_list_troli = 'https://kubuku.id/api/wl/listTroli';
const url_set_troli = 'https://kubuku.id/api/wl/setTroli2';
const url_delete_troli = 'https://kubuku.id/api/wl/deleteTroli';
const url_cek_voucher = 'https://kubuku.id/api/wl/cekKodeVoucher2';
const url_payment_method = 'https://kubuku.id/api/wl/getPaymentType';
const url_checkout_token = 'https://kubuku.id/api/wl/checkOutToken';
const url_cancel_po = 'https://kubuku.id/api/wl/cancelPO';
const url_list_po = 'https://kubuku.id/api/wl/listPO';
const url_list_po_detail = 'https://kubuku.id/api/wl/listPODetail';
const url_logout = 'https://kubuku.id/api/wl/executeLogout';
const url_pinjam = 'https://kubuku.id/api/wl/requestPinjam';
const url_daftar_pinjam = 'https://kubuku.id/api/wl/storeUserKonten';
const url_pengembalian = 'https://kubuku.id/api/wl/returnPinjam';
const url_update_foto = 'https://kubuku.id/api/wl/updatePhotoProfile';
const url_request_baca = 'https://kubuku.id/api/wl/requestBaca';
const url_check_pinjam = 'https://kubuku.id/api/wl/checkPinjam';
const url_list_event = 'https://kubuku.id/api/wl/listEvent';
const url_masuk_event = 'https://kubuku.id/api/wl/masukEvent';
const url_intro_page = 'https://kubuku.id/api/wl/kataSambutan2';
const url_direct_return = 'https://kubuku.id/api/wl/directReturn';
const url_forgot_password = 'https://kubuku.id/api/wl/forgotPassword';
var custom_headers;

function showWarningMessage(message) {
    Swal.fire({
        title: 'Perhatian',
        text: message,
        icon: 'warning',
    });
}
function showLoader(msg) {
    Swal.fire({
        title: msg,
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
    });
}

function truncateText(text, length) {
    if (text.length > length) {
        text = text.substring(0, length - 4) + '....';
        return text;
    } else {
        return text;
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(pass) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(pass);
}

function requestHeaders() {
    ipcRenderer.send('custom-header-permission', '1');
}

function executePost(url, postData, callback) {
    $.ajax({
        url: url,
        data: postData,
        type: 'post',
        dataType: 'json',
        success: callback,
        error: function () {
            Swal.close();
            Swal.fire({
                title: 'Oops..',
                text: 'Terjadi masalah dengan jaringan\nCobalah beberapa saat lagi',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.close();
                }
            });
        },
        timeout: 30000,
    });
}

function executePostJSON(posturl, postfields, callback) {
    $.ajax({
        url: posturl,
        data: JSON.stringify(postfields),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: callback,
        error: function () {
            Swal.close();
            Swal.fire({
                title: 'Oops..',
                text: 'Koneksi Timeout\nCobalah beberapa saat lagi',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.close();
                }
            });
        },
        timeout: 30000,
    });
}

//-- Using Net Request --//
function executeMultipartPost(url, formData, response, errorHandler) {
    const request = net.request({
        method: 'POST',
        protocol: 'https:',
        hostname: 'kubuku.id',
        path: url,
        redirect: 'follow',
        headers: formData.getHeaders(),
    });

    request.setHeader('CLIENTID', clientID);
    request.on('error', errorHandler);
    request.writable = true;
    formData.pipe(request);
    request.on('response', response);
}

//-- Using Ajax --//
function postMultipart(postUrl, formdata, callback) {
    $.ajax({
        url: postUrl,
        data: formdata,
        type: 'POST',
        contentType: false,
        processData: false,
        success: callback,
    });
}

function executeGet(url, callback) {
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        success: callback,
        error: function () {
            Swal.fire({
                title: 'Oops..',
                text: 'Terjadi masalah dengan jaringan\nCobalah beberapa saat lagi',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.close();
                }
            });
        },
        timeout: 60000,
    });
}

const executeGetHTML = (url, callback) => {
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'html',
        success: callback,
        error: function () {
            Swal.fire({
                title: 'Oops..',
                text: 'Koneksi Timeout\nCobalah beberapa saat lagi',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.close();
                }
            });
        },
        timeout: 30000,
    });
};
var networkErrorCallback = (error) => {};

ipcRenderer.on('custom-header-received', (event, headers) => {
    //ipcRenderer.send('console-log', 'On Header Received');
    custom_headers = headers;
    $.ajaxSetup({ headers: custom_headers });
});

//-- Fungsi Baca dan deTil buku --//
const detailBuku = (id) => {
    //console.log('DETAIL ID ' + id);
    ipcRenderer.send('book-detail', id);
};

//-- Fungsi Baca --//
const baca = (id) => {
    let data = { id_konten: id, pinjam: false };
    ipcRenderer.send('check-read-count', data);
};

//-- Fungsi Baca Pinjam --//
const bacaPinjam = (id_konten, id_pinjam) => {
    //-- Check Tab --//
    let data = { id_konten: id_konten, id_pinjam: id_pinjam, pinjam: true };
    ipcRenderer.send('check-read-count', data);
};

const checkPinjam = (id_konten, id_pinjam) => {
    showLoader('Memeriksa hak pinjam..');
    var post_data = { id_konten: id_konten };
    executePost(url_check_pinjam, post_data, (response) => {
        Swal.close();
        if (response.code == 200) {
            if (response.valid == '1') {
                response.id_konten = id_konten;
                response.id_pinjam = id_pinjam;
                response.id_baca = '0';
                response.reader_key = reader_key;
                ipcRenderer.send('read-book', response);
            } else {
                //-- Kembalikan Pinjaman --//
                var btn_id = $('#book-' + id_konten);
                pengembalianBuku(btn_id, id_pinjam);
            }
        }
    });
};

const pengembalianBuku = (btn_id, id_pinjam) => {
    showLoader('Mengembalikan');
    var post_data = { id_pinjam: id_pinjam };
    executePost(url_pengembalian, post_data, (response) => {
        Swal.close();
        if (response.code == 200) {
            btn_id.remove();
        } else {
            if (response.code != 500) {
                showWarningMessage(response.msg);
            } else {
                ipcRenderer.send('force-logout', '1');
            }
        }
    });
};

ipcRenderer.on('read-count-result', (event, data) => {
    if (data.allow == true) {
        let id_konten = data.id_konten;
        if (data.pinjam == false) {
            if (data.hasOwnProperty('idx')) {
                //ipcRenderer.send('console-log', 'Request Baca Langsung');
                requestBacaLangsung(data);
            } else {
                requestBaca(id_konten);
            }
        } else {
            data.id_baca = '0';
            checkPinjam(data.id_konten, data.id_pinjam);
            //ipcRenderer.send('read-book', id_konten);
        }
    } else {
        showWarningMessage('Anda sudah mencapai batas baca yang diperbolehkan');
    }
});

const requestBaca = (id_konten) => {
    showLoader('Proses');
    var post_data = { id_konten: id_konten };
    executePost(url_request_baca, post_data, (response) => {
        Swal.close();
        setTimeout(() => {
            if (response.code == 200) {
                response.id_konten = id_konten;
                response.reader_key = reader_key;
                //ipcRenderer.send('console-log', 'REQUEST BACA');
                //ipcRenderer.send('console-log', JSON.stringify(response));
                ipcRenderer.send('read-book', response);
            } else {
                if (response.code != 500) {
                    showWarningMessage(response.msg);
                } else {
                    ipcRenderer.send('force-logout', '1');
                }
            }
        }, 1000);
    });
};

const requestBacaLangsung = (data) => {
    var id_konten = data.id_konten;
    showLoader('Proses');
    var post_data = { id_konten: id_konten };
    executePost(url_request_baca, post_data, (response) => {
        Swal.close();
        setTimeout(() => {
            if (response.code == 200) {
                response.id_konten = id_konten;
                response.reader_key = reader_key;
                response.idx = data.idx;
                response.keyword = data.keyword;
                //ipcRenderer.send('console-log', JSON.stringify(response));
                ipcRenderer.send('read-book', response);
            } else {
                if (response.code != 500) {
                    showWarningMessage(response.msg);
                } else {
                    ipcRenderer.send('force-logout', '1');
                }
            }
        }, 1000);
    });
};

const bacaLangsung = (id, idx, keyword) => {
    //-- Ambil Detail nya dulu --//
    var post_data = { id_konten: id };
    showLoader('Memuat data');
    executePost(url_detail_buku, post_data, (response) => {
        Swal.close();
        //ipcRenderer.send('console-log', JSON.stringify(response));
        if (response.code == 200) {
            //-- TODO: Baca langsung ke page_index --//
            let data = { id_konten: response.data.id, pinjam: false, idx: idx, keyword: keyword };
            ipcRenderer.send('check-read-count', data);
        } else {
            if (response.code != 500) {
                showWarningMessage(response.msg);
            } else {
                ipcRenderer.send('force-logout', '1');
            }
        }
    });
};
