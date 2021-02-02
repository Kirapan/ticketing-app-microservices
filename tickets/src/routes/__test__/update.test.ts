import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).set('Cookie', global.signin()).send({
        title: 'test',
        price: 20
    }).expect(404);
});

it('returns a 401 if the user is not logged in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).send({
        title: 'test',
        price: 20
    }).expect(401);
});

it('returns a 401 if the user is not the owner of the ticket', async () => {
    const res = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
        title: 'test',
        price: 20
    });
    await request(app).put(`/api/tickets/${res.body.id}`).set('Cookie', global.signin()).send({
        title: 'update',
        price: 20
    }).expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const res = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'test',
        price: 20
    });
    await request(app).put(`/api/tickets/${res.body.id}`).set('Cookie', cookie).send({
        title: '',
        price: 20
    }).expect(400);
    await request(app).put(`/api/tickets/${res.body.id}`).set('Cookie', cookie).send({
        title: 'update',
        price: ''
    }).expect(400);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const res = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'test',
        price: 20
    });
    await request(app).put(`/api/tickets/${res.body.id}`).set('Cookie', cookie).send({
        title: 'new update',
        price: 100
    }).expect(200);

    const response = await request(app).get(`/api/tickets/${res.body.id}`).send();
    expect(response.body.title).toEqual('new update');
    expect(response.body.price).toEqual(100);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    const res = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'test',
        price: 20
    });
    await request(app).put(`/api/tickets/${res.body.id}`).set('Cookie', cookie).send({
        title: 'new update',
        price: 100
    }).expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled;
});