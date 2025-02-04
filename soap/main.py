from spyne import Application, rpc, ServiceBase, Float, Integer, ComplexModel
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

# Define a response model for the estimation
class EstimationResponse(ComplexModel):
    duration_travel_min = Float
    duration_recharge_min = Float
    total_duration = Float
    total_price = Float

class TravelEstimationService(ServiceBase):
    @rpc(Float, Integer, Float, _returns=EstimationResponse)
    def estimation(ctx, distance_km, nb_stops, autonomy):
        vitesse_moyenne = 60.0
        chargement_min = autonomy * 2
        price_per_kwh = 0.20

        duration_travel_min = (distance_km / vitesse_moyenne) * 60
        duration_recharge_min = nb_stops * chargement_min
        total_duration = duration_travel_min + duration_recharge_min
        total_price = (price_per_kwh * autonomy) * nb_stops

        # Return an EstimationResponse with named fields
        return EstimationResponse(
            duration_travel_min=duration_travel_min,
            duration_recharge_min=duration_recharge_min,
            total_duration=total_duration,
            total_price=total_price
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
