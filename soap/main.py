from spyne import Application, rpc, ServiceBase, Float, Integer, ComplexModel
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

class EstimationResponse(ComplexModel):
    duration_travel_min = Float
    avg_speed = Float
    nb_stops = Integer
    duration_recharge_min = Float
    min_per_kwh = Float
    total_duration = Float
    total_price = Float
    price_per_kwh = Float

class TravelEstimationService(ServiceBase):
    @rpc(Float, Integer, Float, _returns=EstimationResponse)
    def estimation(ctx, distance_m, nb_stops, autonomy):
        vitesse_moyenne = float(60.0)
        min_per_kwh = float(0.3)
        chargement_min = autonomy * min_per_kwh
        price_per_kwh = float(0.20)

        duration_travel_min = ((distance_m / 1000) / vitesse_moyenne) * 60
        duration_recharge_min = nb_stops * chargement_min
        total_duration = duration_travel_min + duration_recharge_min
        total_price = (price_per_kwh * autonomy) * nb_stops

        return EstimationResponse(
            duration_travel_min=duration_travel_min,
            avg_speed=vitesse_moyenne,
            nb_stops=nb_stops,
            duration_recharge_min=duration_recharge_min,
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
    from wsgiref.simple_server import make_server
    server = make_server('0.0.0.0', 8000, wsgi_application)
    print("SOAP service running on http://0.0.0.0:8000")
    server.serve_forever()
