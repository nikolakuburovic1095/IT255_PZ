import { Component, Directive } from 'angular2/core';
import { FormBuilder, Validators, ControlGroup, Control, FORM_DIRECTIVES, FORM_BINDINGS} from 'angular2/common';
import {Http, HTTP_PROVIDERS, Headers} from 'angular2/http';
import 'rxjs/Rx';
import {Router, ROUTER_PROVIDERS} from 'angular2/router';

@Component({
    selector: 'Login',
    templateUrl: 'app/login/login.html',
    styleUrls: ['css/loginregister.css'],
    directives: [FORM_DIRECTIVES],
    viewBindings: [FORM_BINDINGS]
})

export class LoginComponent {
    loginForm: ControlGroup;
    http: Http;
    router: Router;
    postResponse: String;
    constructor(builder: FormBuilder, http: Http, router: Router) {
        this.http = http;
        this.router = router;
        this.loginForm = builder.group({
            username: ["", Validators.none],
            password: ["", Validators.none],
        });
        if (localStorage.getItem('token') != null) {
            this.router.parent.navigate(['./MainPage']);
        }
    }
    onLogin(): void {
        var data = "KORISNIK_USERNAME=" + this.loginForm.value.username + "&KORISNIK_PASSWORD=" + this.loginForm.value.password;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post('http://localhost/WebBiblioteka/login.php', data, { headers: headers })
            .map(res => res)
            .subscribe(data => this.postResponse = data,
            err => {

                var obj = JSON.parse(err._body);
                document.getElementsByClassName("alert")[0].style.display = "block";
                document.getElementsByClassName("alert")[0].innerHTML =
                    obj.error.split("\\r\\n").join("<br/>").split("\"").join("");
            },
            () => {
                var obj = JSON.parse(this.postResponse._body);
                localStorage.setItem('token', obj.token);
                localStorage.setItem('admin', obj.admin);
                this.router.parent.navigate(['./MainPage']);

            }
            );
            
    }

    
}