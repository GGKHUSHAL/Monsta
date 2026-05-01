const countryUseadd = require("../../model/countryModel");

const getActiveCountries = async (req, res) => {
    try {
        const data = await countryUseadd
            .find({
                _countryDeletedAt: null,
                _status: true
            })
            .sort({ _order: 1, _countryName: 1 });

        return res.send({
            _status: true,
            _message: "Countries fetched successfully",
            data
        });
    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

module.exports = { getActiveCountries };
