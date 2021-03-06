/**
 * Copyright 2017-2018 the original author or authors from the JHipster Online project.
 *
 * This file is part of the JHipster Online project, see https://github.com/jhipster/jhipster-online
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginService } from 'app/core/login/login.service';
import { JhiLoginModalComponent } from 'app/shared/login/login.component';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { JhonlineTestModule } from '../../../test.module';
import { MockLoginService } from '../../../helpers/mock-login.service';
import { MockStateStorageService } from '../../../helpers/mock-state-storage.service';

describe('Component Tests', () => {
    describe('LoginComponent', () => {
        let comp: JhiLoginModalComponent;
        let fixture: ComponentFixture<JhiLoginModalComponent>;
        let mockLoginService: any;
        let mockStateStorageService: any;
        let mockRouter: any;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(
            async(() => {
                TestBed.configureTestingModule({
                    imports: [JhonlineTestModule],
                    declarations: [JhiLoginModalComponent],
                    providers: [
                        {
                            provide: LoginService,
                            useClass: MockLoginService
                        },
                        {
                            provide: StateStorageService,
                            useClass: MockStateStorageService
                        }
                    ]
                })
                    .overrideTemplate(JhiLoginModalComponent, '')
                    .compileComponents();
            })
        );

        beforeEach(() => {
            fixture = TestBed.createComponent(JhiLoginModalComponent);
            comp = fixture.componentInstance;
            mockLoginService = fixture.debugElement.injector.get(LoginService);
            mockStateStorageService = fixture.debugElement.injector.get(StateStorageService);
            mockRouter = fixture.debugElement.injector.get(Router);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        it(
            'should authenticate the user upon login when previous state was set',
            inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    const credentials = {
                        username: 'admin',
                        password: 'admin',
                        rememberMe: true
                    };
                    comp.username = 'admin';
                    comp.password = 'admin';
                    comp.rememberMe = true;
                    comp.credentials = credentials;
                    mockLoginService.setResponse({});
                    mockStateStorageService.setResponse({ redirect: 'dummy' });

                    // WHEN/
                    comp.login();
                    tick(); // simulate async

                    // THEN
                    expect(comp.authenticationError).toEqual(false);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('login success');
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalledTimes(1);
                    expect(mockLoginService.loginSpy).toHaveBeenCalledWith(credentials);
                    expect(mockStateStorageService.getUrlSpy).toHaveBeenCalledTimes(1);
                    expect(mockStateStorageService.storeUrlSpy).toHaveBeenCalledWith(null);
                    expect(mockRouter.navigateSpy).toHaveBeenCalledWith([{ redirect: 'dummy' }]);
                })
            )
        );

        it(
            'should authenticate the user upon login when previous state was not set',
            inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    const credentials = {
                        username: 'admin',
                        password: 'admin',
                        rememberMe: true
                    };
                    comp.username = 'admin';
                    comp.password = 'admin';
                    comp.rememberMe = true;
                    comp.credentials = credentials;
                    mockLoginService.setResponse({});
                    mockStateStorageService.setResponse(null);

                    // WHEN
                    comp.login();
                    tick(); // simulate async

                    // THEN
                    expect(comp.authenticationError).toEqual(false);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('login success');
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalledTimes(1);
                    expect(mockLoginService.loginSpy).toHaveBeenCalledWith(credentials);
                    expect(mockStateStorageService.getUrlSpy).toHaveBeenCalledTimes(1);
                    expect(mockStateStorageService.storeUrlSpy).not.toHaveBeenCalled();
                    expect(mockRouter.navigateSpy).not.toHaveBeenCalled();
                })
            )
        );

        it('should empty the credentials upon cancel', () => {
            // GIVEN
            const credentials = {
                username: 'admin',
                password: 'admin',
                rememberMe: true
            };

            const expected = {
                username: null,
                password: null,
                rememberMe: true
            };

            comp.credentials = credentials;

            // WHEN
            comp.cancel();

            // THEN
            expect(comp.authenticationError).toEqual(false);
            expect(comp.credentials).toEqual(expected);
            expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('cancel');
        });

        it('should redirect user when register', () => {
            // WHEN
            comp.register();

            // THEN
            expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('to state register');
            expect(mockRouter.navigateSpy).toHaveBeenCalledWith(['/register']);
        });

        it('should redirect user when request password', () => {
            // WHEN
            comp.requestResetPassword();

            // THEN
            expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('to state requestReset');
            expect(mockRouter.navigateSpy).toHaveBeenCalledWith(['/reset', 'request']);
        });
    });
});
