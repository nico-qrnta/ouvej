import os
from spyne import Application, rpc, ServiceBase, Float, Integer, ComplexModel
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

class EstimationResponse(ComplexModel):
    total_distance = Float
    duration_travel_min = Float
    avg_speed = Float
    nb_stops = Integer
    duration_recharge = Float
    min_per_kwh = Float
    total_duration = Float
    total_price = Float
    price_per_kwh = Float

class TravelEstimationService(ServiceBase):
    @rpc(Float, Integer, Float, _returns=EstimationResponse)
    def estimation(ctx, distance_m, nb_stops, autonomy):
        vitesse_moyenne = 60.0
        min_per_kwh = 0.3
        chargement_min = autonomy * min_per_kwh
        price_per_kwh = 0.20
        distance_km = round(distance_m / 1000, 2)

        duration_travel_min = (distance_km / vitesse_moyenne) * 60
        duration_recharge_min = nb_stops * chargement_min
        total_duration = duration_travel_min + duration_recharge_min
        total_price = round((price_per_kwh * autonomy) * nb_stops, 2)

        return EstimationResponse(
            total_distance=distance_km,
            duration_travel_min=duration_travel_min,
            avg_speed=vitesse_moyenne,
            nb_stops=nb_stops,
            duration_recharge=duration_recharge_min,
            min_per_kwh=min_per_kwh,
            total_duration=total_duration,
            total_price=total_price,
            price_per_kwh=price_per_kwh
        )

application = Application(
    [TravelEstimationService],
    "estimation.soap",
    in_protocol=Soap11(validator="lxml"),
    out_protocol=Soap11()
)

wsgi_application = WsgiApplication(application)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    from wsgiref.simple_server import make_server
    server = make_server('0.0.0.0', port, wsgi_application)
    print(f'SOAP service running on port {port}')
    server.serve_forever()
